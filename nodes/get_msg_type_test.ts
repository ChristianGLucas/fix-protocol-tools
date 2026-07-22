import { RawFixMessage } from '../gen/messages_pb';
import { getMsgType } from './get_msg_type';
import { testContext, PIPE_SAMPLE_NEW_ORDER } from './test_helpers';

describe('GetMsgType', () => {
  it('extracts and decodes MsgType', () => {
    const input = new RawFixMessage();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = getMsgType(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(true);
    expect(result.getMsgType()).toBe('D');
    expect(result.getMsgTypeName()).toBe('NewOrderSingle');
  });

  it('decodes a session-admin MsgType (Heartbeat)', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|35=0|10=000|');
    const result = getMsgType(testContext, input);
    expect(result.getMsgType()).toBe('0');
    expect(result.getMsgTypeName()).toBe('Heartbeat');
  });

  it('reports found=false when tag 35 is absent', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|58=hello|10=000|');
    const result = getMsgType(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(false);
  });

  it('found=true with empty name for an unrecognized MsgType code', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|35=ZZ|10=000|');
    const result = getMsgType(testContext, input);
    expect(result.getFound()).toBe(true);
    expect(result.getMsgType()).toBe('ZZ');
    expect(result.getMsgTypeName()).toBe('');
  });
});
