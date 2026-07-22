import { RawFixMessage } from '../gen/messages_pb';
import { classifyMessage } from './classify_message';
import { testContext, PIPE_SAMPLE_NEW_ORDER } from './test_helpers';

describe('ClassifyMessage', () => {
  it('classifies NewOrderSingle (D) as application', () => {
    const input = new RawFixMessage();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = classifyMessage(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getMsgType()).toBe('D');
    expect(result.getMsgTypeName()).toBe('NewOrderSingle');
    expect(result.getCategory()).toBe('application');
  });

  it('classifies Heartbeat (0) as admin', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|35=0|10=000|');
    const result = classifyMessage(testContext, input);
    expect(result.getCategory()).toBe('admin');
  });

  it('classifies Logon (A) as admin', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|35=A|10=000|');
    const result = classifyMessage(testContext, input);
    expect(result.getCategory()).toBe('admin');
  });

  it('classifies an unrecognized MsgType code as unknown', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|35=ZZ|10=000|');
    const result = classifyMessage(testContext, input);
    expect(result.getCategory()).toBe('unknown');
    expect(result.getMsgTypeName()).toBe('');
  });

  it('classifies as unknown when MsgType is absent entirely', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|58=hi|10=000|');
    const result = classifyMessage(testContext, input);
    expect(result.getCategory()).toBe('unknown');
  });
});
