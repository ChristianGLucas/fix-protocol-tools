import { RawFixMessage, ValidationOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, findField, reconstructAndByteLength, FixInputError } from './fix_helpers';

/**
 * Validates that the declared BodyLength (tag 9) matches the actual byte
 * length of the message body — the bytes strictly between the end of the
 * BodyLength field and the start of the CheckSum (tag 10) field, per the
 * FIX spec's definition of BodyLength. `valid` is false whenever the
 * declared and actual lengths differ (including when tag 9 is absent or
 * non-numeric, in which case `declared_body_length` is 0).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateBodyLength(ax: AxiomContext, input: RawFixMessage): ValidationOutput {
  const out = new ValidationOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    const declaredRaw = findField(parsed.fields, 9);
    const declared = declaredRaw !== undefined && /^\d+$/.test(declaredRaw) ? Number(declaredRaw) : 0;

    // Body = every field strictly after tag 9 and strictly before the first
    // tag-10 field (CheckSum is always last on the wire; guarding against a
    // stray earlier "10=" defensively by taking the first one).
    const tag9Index = parsed.fields.findIndex((f) => f.tag === 9);
    const tag10Index = parsed.fields.findIndex((f) => f.tag === 10);
    const startIdx = tag9Index === -1 ? 0 : tag9Index + 1;
    const endIdx = tag10Index === -1 ? parsed.fields.length : tag10Index;
    const bodyFields = parsed.fields.slice(startIdx, Math.max(startIdx, endIdx));
    const { bytes } = reconstructAndByteLength(bodyFields, parsed.delimiterChars);

    out.setOk(true);
    out.setError('');
    out.setDeclaredBodyLength(declared);
    out.setActualBodyLength(bytes);
    out.setValid(declaredRaw !== undefined && declared === bytes);
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
