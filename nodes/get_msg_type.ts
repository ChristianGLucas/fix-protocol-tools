import { RawFixMessage, MsgTypeOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, findField, msgTypeName, FixInputError } from './fix_helpers';

/**
 * Extracts the MsgType (tag 35) and decodes it to its name using the
 * embedded FIX dictionary (e.g. "D" -> "NewOrderSingle", "8" ->
 * "ExecutionReport"). `found` is false if tag 35 is absent from the
 * message; if present but not a recognized code, `found` is true and
 * `msg_type_name` is empty (still a syntactically valid message — just an
 * unrecognized or custom MsgType).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getMsgType(ax: AxiomContext, input: RawFixMessage): MsgTypeOutput {
  const out = new MsgTypeOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    const mt = findField(parsed.fields, 35);
    out.setOk(true);
    out.setError('');
    if (mt === undefined) {
      out.setFound(false);
    } else {
      out.setFound(true);
      out.setMsgType(mt);
      out.setMsgTypeName(msgTypeName(mt));
    }
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
