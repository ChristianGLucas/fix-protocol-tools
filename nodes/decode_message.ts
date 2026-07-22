import { RawFixMessage, DecodedMessageOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, toDecodedFixFields, findField, msgTypeName, FixInputError } from './fix_helpers';

/**
 * Decodes a FIX message with human-readable field NAMES attached from the
 * embedded FIX data dictionary — every field carries {tag, value, name}
 * where `name` is e.g. "Symbol" for tag 55 (empty when the tag isn't in the
 * dictionary), plus the MsgType (tag 35) decoded to its own name (e.g. "D"
 * -> "NewOrderSingle", empty if MsgType is absent or unrecognized).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function decodeMessage(ax: AxiomContext, input: RawFixMessage): DecodedMessageOutput {
  const out = new DecodedMessageOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    out.setOk(true);
    out.setError('');
    out.setFieldsList(toDecodedFixFields(parsed.fields));
    const mt = findField(parsed.fields, 35) || '';
    out.setMsgType(mt);
    out.setMsgTypeName(mt ? msgTypeName(mt) : '');
    out.setDelimiterUsed(parsed.delimiterName);
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
