import { RawFixMessage, HeaderFieldsOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, findField, msgTypeName, FixInputError } from './fix_helpers';

/**
 * Extracts the FIX standard header fields: BeginString(8), BodyLength(9),
 * MsgType(35, plus its decoded name), SenderCompID(49), TargetCompID(56),
 * MsgSeqNum(34), and SendingTime(52). A header field absent from the
 * message leaves its output field at its zero value (empty string / 0);
 * check `missing_fields` (the tag numbers that were absent) to distinguish
 * that from a genuinely empty/zero value on the wire.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getHeaderFields(ax: AxiomContext, input: RawFixMessage): HeaderFieldsOutput {
  const out = new HeaderFieldsOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    const missing: number[] = [];

    const beginString = findField(parsed.fields, 8);
    if (beginString === undefined) missing.push(8);
    out.setBeginString(beginString || '');

    const bodyLength = findField(parsed.fields, 9);
    if (bodyLength === undefined) missing.push(9);
    out.setBodyLength(bodyLength !== undefined && /^\d+$/.test(bodyLength) ? Number(bodyLength) : 0);

    const msgType = findField(parsed.fields, 35);
    if (msgType === undefined) missing.push(35);
    out.setMsgType(msgType || '');
    out.setMsgTypeName(msgType ? msgTypeName(msgType) : '');

    const senderCompId = findField(parsed.fields, 49);
    if (senderCompId === undefined) missing.push(49);
    out.setSenderCompId(senderCompId || '');

    const targetCompId = findField(parsed.fields, 56);
    if (targetCompId === undefined) missing.push(56);
    out.setTargetCompId(targetCompId || '');

    const msgSeqNum = findField(parsed.fields, 34);
    if (msgSeqNum === undefined) missing.push(34);
    out.setMsgSeqNum(msgSeqNum !== undefined && /^\d+$/.test(msgSeqNum) ? Number(msgSeqNum) : 0);

    const sendingTime = findField(parsed.fields, 52);
    if (sendingTime === undefined) missing.push(52);
    out.setSendingTime(sendingTime || '');

    out.setOk(true);
    out.setError('');
    out.setMissingFieldsList(missing);
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
