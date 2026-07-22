import { RawFixMessage, ClassifyOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, findField, msgTypeName, FixInputError } from './fix_helpers';
import { ADMIN_MSG_TYPES, MSG_TYPES } from './fix_dictionary';

/**
 * Classifies a message as "admin" (session-level: Heartbeat, TestRequest,
 * ResendRequest, Reject, SequenceReset, Logout, Logon), "application" (any
 * other MsgType recognized by the embedded dictionary — orders,
 * executions, market data, etc.), or "unknown" (MsgType is absent, or a
 * code not in the dictionary — still a syntactically valid message, just
 * an unrecognized or custom MsgType this package cannot classify).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function classifyMessage(ax: AxiomContext, input: RawFixMessage): ClassifyOutput {
  const out = new ClassifyOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    const mt = findField(parsed.fields, 35) || '';
    out.setOk(true);
    out.setError('');
    out.setMsgType(mt);
    if (mt === '' || !(mt in MSG_TYPES)) {
      out.setMsgTypeName('');
      out.setCategory('unknown');
    } else {
      out.setMsgTypeName(msgTypeName(mt));
      out.setCategory(ADMIN_MSG_TYPES.has(mt) ? 'admin' : 'application');
    }
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
