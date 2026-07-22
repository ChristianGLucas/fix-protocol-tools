import { RawFixMessage } from '../gen/messages_pb';
import { decodeMessage } from './decode_message';
import { testContext, PIPE_SAMPLE_NEW_ORDER } from './test_helpers';

describe('DecodeMessage', () => {
  it('attaches dictionary names to fields and decodes MsgType', () => {
    const input = new RawFixMessage();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = decodeMessage(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getMsgType()).toBe('D');
    expect(result.getMsgTypeName()).toBe('NewOrderSingle');
    const fields = result.getFieldsList();
    const symbolField = fields.find((f) => f.getTag() === 55);
    expect(symbolField?.getName()).toBe('Symbol');
    expect(symbolField?.getValue()).toBe('AAPL');
    const beginStringField = fields.find((f) => f.getTag() === 8);
    expect(beginStringField?.getName()).toBe('BeginString');
  });

  it('leaves name empty for a tag not in the dictionary', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|35=D|9999=custom|10=000|');
    const result = decodeMessage(testContext, input);
    const custom = result.getFieldsList().find((f) => f.getTag() === 9999);
    expect(custom?.getName()).toBe('');
  });

  it('returns an empty msg_type_name when MsgType is absent', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|58=hello|10=000|');
    const result = decodeMessage(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getMsgType()).toBe('');
    expect(result.getMsgTypeName()).toBe('');
  });
});
