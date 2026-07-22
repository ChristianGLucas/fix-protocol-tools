import { RawFixMessage, FieldListOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, toFixFields, FixInputError } from './fix_helpers';

/**
 * Parses a raw FIX message into an ordered list of {tag, value} fields,
 * exactly as they appeared on the wire (no dictionary decoding, no dedup)
 * — the lowest-level view of a message. Handles SOH (0x01), '|', or literal
 * "^A" delimited input, auto-detecting which one was used unless
 * `delimiter` overrides it ("SOH"/"PIPE"/"CARET"). Returns ok=false with a
 * structured error for malformed input (no delimiter found, a segment not
 * shaped like "<tag>=<value>", or input exceeding the size/field-count
 * bounds) rather than throwing.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseFields(ax: AxiomContext, input: RawFixMessage): FieldListOutput {
  const out = new FieldListOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    out.setOk(true);
    out.setError('');
    out.setFieldsList(toFixFields(parsed.fields));
    out.setDelimiterUsed(parsed.delimiterName);
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
