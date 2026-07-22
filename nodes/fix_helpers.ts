// Shared FIX (Financial Information eXchange) message parsing helpers.
// Every node goes through this module — it owns:
//   - delimiter auto-detection (SOH 0x01 / '|' / literal "^A")
//   - input-surface safety bounds (byte size + field count), checked BEFORE
//     any parsing work
//   - the core tag=value tokenizer (parseFieldsCore), which every other
//     operation (map view, header/order extraction, groups, checksum,
//     body-length) is built on top of, so they all agree on what "a field"
//     is
//   - the FIX BodyLength/CheckSum integrity algorithms (pure arithmetic,
//     spec-defined, no library needed)
//
// No network, no wall-clock, no randomness — every function here is a pure,
// deterministic transform of the string(s) passed in.

import { FixField } from '../gen/messages_pb';
import { FIELD_NAMES, NAME_TO_TAG, MSG_TYPES } from './fix_dictionary';

// --- Input-surface safety bounds --------------------------------------------

// A single FIX message larger than this is rejected before parsing. 1 MiB
// comfortably covers any real single order/execution/market-data message
// (which are typically well under 4 KB) with wide headroom.
export const MAX_MESSAGE_BYTES = 1_048_576;
// Cheap pre-check on JS string length (O(1)) before the more precise
// Buffer.byteLength pass, so a pathologically huge input is rejected
// without ever touching an O(n) UTF-8 byte-length scan.
const MAX_MESSAGE_CHARS_PRECHECK = 4_000_000;
export const MAX_FIELDS = 20_000;

// A FIX LOG (multiple concatenated messages) is allowed to be larger, but
// still bounded — 4 MiB matches the Axiom node transport ceiling, so a log
// too large to ever be delivered in one call is rejected with a clear error
// rather than silently truncated.
export const MAX_LOG_BYTES = 4_000_000;
const MAX_LOG_CHARS_PRECHECK = 8_000_000;
export const MAX_LOG_MESSAGES = 5_000;

export class FixInputError extends Error {}

// --- Delimiter handling -------------------------------------------------------

export const SOH = '';
export const PIPE = '|';
export const CARET = '^A';

export type DelimiterName = 'SOH' | 'PIPE' | 'CARET';

function delimiterChars(name: DelimiterName): string {
  if (name === 'SOH') return SOH;
  if (name === 'PIPE') return PIPE;
  return CARET;
}

/**
 * Determines which delimiter to use: `override` ("SOH"/"PIPE"/"CARET") when
 * given and valid, else auto-detected from `raw` — SOH is checked first
 * (the actual wire byte), then the two-character "^A" literal, then '|'
 * (the common human-readable stand-in). Throws FixInputError if `override`
 * is an unrecognized name, or if auto-detection finds none of the three.
 */
export function resolveDelimiter(raw: string, override: string | undefined | null): { name: DelimiterName; chars: string } {
  const ov = (override || '').trim().toUpperCase();
  if (ov === 'SOH' || ov === 'PIPE' || ov === 'CARET') {
    return { name: ov as DelimiterName, chars: delimiterChars(ov as DelimiterName) };
  }
  if (ov !== '') {
    throw new FixInputError(`unrecognized delimiter override "${override}" — expected "SOH", "PIPE", or "CARET"`);
  }
  if (raw.indexOf(SOH) !== -1) return { name: 'SOH', chars: SOH };
  if (raw.indexOf(CARET) !== -1) return { name: 'CARET', chars: CARET };
  if (raw.indexOf(PIPE) !== -1) return { name: 'PIPE', chars: PIPE };
  throw new FixInputError('could not auto-detect a field delimiter (none of SOH 0x01, "^A", or "|" found in the input)');
}

// --- Bounds checks -----------------------------------------------------------

export function checkMessageBounds(raw: string): void {
  if (raw.length > MAX_MESSAGE_CHARS_PRECHECK) {
    throw new FixInputError(`input is ${raw.length} characters, which exceeds the maximum of ${MAX_MESSAGE_CHARS_PRECHECK}`);
  }
  const byteLen = Buffer.byteLength(raw, 'utf8');
  if (byteLen > MAX_MESSAGE_BYTES) {
    throw new FixInputError(`input is ${byteLen} bytes, which exceeds the maximum of ${MAX_MESSAGE_BYTES}`);
  }
  if (raw.trim() === '') {
    throw new FixInputError('input is empty');
  }
}

export function checkLogBounds(raw: string): void {
  if (raw.length > MAX_LOG_CHARS_PRECHECK) {
    throw new FixInputError(`input is ${raw.length} characters, which exceeds the maximum of ${MAX_LOG_CHARS_PRECHECK}`);
  }
  const byteLen = Buffer.byteLength(raw, 'utf8');
  if (byteLen > MAX_LOG_BYTES) {
    throw new FixInputError(`input is ${byteLen} bytes, which exceeds the maximum of ${MAX_LOG_BYTES}`);
  }
  if (raw.trim() === '') {
    throw new FixInputError('input is empty');
  }
}

// --- Core tokenizer ------------------------------------------------------------

export interface ParsedField {
  tag: number;
  value: string;
}

export interface ParsedMessage {
  fields: ParsedField[];
  delimiterName: DelimiterName;
  delimiterChars: string;
}

/**
 * Tokenizes `raw` into an ordered list of {tag, value} pairs on the resolved
 * delimiter. Every non-empty segment must have the shape `<digits>=<value>`
 * (only the FIRST '=' splits tag from value, so a value itself containing
 * '=' is preserved intact); a segment that doesn't match throws
 * FixInputError naming the offending segment. Throws if bounds are exceeded
 * or the field count exceeds MAX_FIELDS.
 */
export function parseFieldsCore(raw: string, delimiterOverride: string | undefined | null): ParsedMessage {
  checkMessageBounds(raw);
  const { name, chars } = resolveDelimiter(raw, delimiterOverride);
  const segments = raw.split(chars).filter((s) => s.length > 0);
  if (segments.length > MAX_FIELDS) {
    throw new FixInputError(`input has ${segments.length} fields, which exceeds the maximum of ${MAX_FIELDS}`);
  }
  const fields: ParsedField[] = [];
  for (const seg of segments) {
    const eq = seg.indexOf('=');
    if (eq <= 0) {
      throw new FixInputError(`malformed field "${seg}" — expected "<tag>=<value>"`);
    }
    const tagStr = seg.slice(0, eq);
    if (!/^\d+$/.test(tagStr)) {
      throw new FixInputError(`malformed field "${seg}" — tag "${tagStr}" is not a positive integer`);
    }
    const tag = Number(tagStr);
    const value = seg.slice(eq + 1);
    fields.push({ tag, value });
  }
  return { fields, delimiterName: name, delimiterChars: chars };
}

/** Converts ParsedField[] to FixField[] proto messages, name empty (undecoded). */
export function toFixFields(fields: ParsedField[]): FixField[] {
  return fields.map((f) => {
    const out = new FixField();
    out.setTag(f.tag);
    out.setValue(f.value);
    out.setName('');
    return out;
  });
}

/** Converts ParsedField[] to FixField[] with dictionary names attached where known. */
export function toDecodedFixFields(fields: ParsedField[]): FixField[] {
  return fields.map((f) => {
    const out = new FixField();
    out.setTag(f.tag);
    out.setValue(f.value);
    out.setName(FIELD_NAMES[f.tag] || '');
    return out;
  });
}

/** First occurrence of `tag` in `fields`, or undefined. */
export function findField(fields: ParsedField[], tag: number): string | undefined {
  const f = fields.find((x) => x.tag === tag);
  return f ? f.value : undefined;
}

/** Looks up a tag number by dictionary field name, case-insensitive. Returns undefined if unknown. */
export function tagForName(fieldName: string): number | undefined {
  return NAME_TO_TAG[(fieldName || '').trim().toLowerCase()];
}

export function msgTypeName(code: string): string {
  return MSG_TYPES[code] || '';
}

// --- BodyLength / CheckSum ------------------------------------------------------

/**
 * Reconstructs the wire-format substring for `fields` (tag=value joined by
 * `delim`, with a trailing delimiter — matching how every field, including
 * the last one before CheckSum, terminates in a real FIX message) and
 * returns its exact UTF-8 byte length. Used for BodyLength.
 */
export function reconstructAndByteLength(fields: ParsedField[], delim: string): { text: string; bytes: number } {
  if (fields.length === 0) return { text: '', bytes: 0 };
  const text = fields.map((f) => `${f.tag}=${f.value}`).join(delim) + delim;
  return { text, bytes: Buffer.byteLength(text, 'utf8') };
}

/** Sum of UTF-8 byte values of `text`, mod 256, as a zero-padded 3-digit string. */
export function computeChecksumOf(text: string): string {
  const buf = Buffer.from(text, 'utf8');
  let sum = 0;
  for (let i = 0; i < buf.length; i++) sum = (sum + buf[i]) & 0xffffffff;
  const mod = sum % 256;
  return String(mod).padStart(3, '0');
}

/**
 * Computes the FIX CheckSum for `fields` per the spec: the sum, mod 256, of
 * every byte in the message from the start up to (but not including) the
 * "10=" (CheckSum) field itself, formatted as 3 zero-padded digits. Strips
 * any existing tag-10 field(s) from `fields` before reconstructing, so this
 * is correct whether or not the caller included one.
 */
export function computeChecksum(fields: ParsedField[], delim: string): string {
  const withoutChecksum = fields.filter((f) => f.tag !== 10);
  const { text } = reconstructAndByteLength(withoutChecksum, delim);
  return computeChecksumOf(text);
}

// --- Log splitting -----------------------------------------------------------

/**
 * Splits a FIX LOG — one or more complete FIX messages concatenated
 * back-to-back, each starting with a BeginString (tag 8) field — into
 * individual message strings, reconstructed with the same delimiter
 * throughout (the whole log is assumed to use one consistent delimiter).
 * Throws FixInputError if bounds are exceeded, no delimiter is found, or
 * any segment is malformed (same tokenizer rules as parseFieldsCore).
 */
export function splitLogCore(raw: string, delimiterOverride: string | undefined | null): { messages: string[]; delimiterName: DelimiterName } {
  checkLogBounds(raw);
  const { name, chars } = resolveDelimiter(raw, delimiterOverride);
  const segments = raw.split(chars).filter((s) => s.length > 0);
  const messages: string[] = [];
  let current: string[] = [];
  for (const seg of segments) {
    if (seg.startsWith('8=') && current.length > 0) {
      messages.push(current.join(chars) + chars);
      current = [];
    }
    current.push(seg);
  }
  if (current.length > 0) messages.push(current.join(chars) + chars);
  if (messages.length > MAX_LOG_MESSAGES) {
    throw new FixInputError(`log contains ${messages.length} messages, which exceeds the maximum of ${MAX_LOG_MESSAGES}`);
  }
  return { messages, delimiterName: name };
}

// --- FIX version -----------------------------------------------------------

const VERSION_RE = /^FIX(T)?\.(\d+)\.(\d+)$/;

export function parseFixVersion(beginString: string): { major: number; minor: number; recognized: boolean } {
  const m = VERSION_RE.exec(beginString);
  if (!m) return { major: 0, minor: 0, recognized: false };
  return { major: Number(m[2]), minor: Number(m[3]), recognized: true };
}
