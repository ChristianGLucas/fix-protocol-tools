import { SplitLogInput } from '../gen/messages_pb';
import { splitLog } from './split_log';
import { parseFields } from './parse_fields';
import { RawFixMessage } from '../gen/messages_pb';
import { testContext, PIPE_SAMPLE_NEW_ORDER } from './test_helpers';

describe('SplitLog', () => {
  it('splits two concatenated messages back into two parseable messages', () => {
    const log = PIPE_SAMPLE_NEW_ORDER + PIPE_SAMPLE_NEW_ORDER;
    const input = new SplitLogInput();
    input.setRaw(log);
    const result = splitLog(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getCount()).toBe(2);
    expect(result.getMessagesList()).toHaveLength(2);
    for (const msg of result.getMessagesList()) {
      const parseInput = new RawFixMessage();
      parseInput.setRaw(msg);
      const parsed = parseFields(testContext, parseInput);
      expect(parsed.getOk()).toBe(true);
      expect(parsed.getFieldsList().find((f) => f.getTag() === 55)?.getValue()).toBe('AAPL');
    }
  });

  it('returns a single message for a log containing just one', () => {
    const input = new SplitLogInput();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = splitLog(testContext, input);
    expect(result.getCount()).toBe(1);
    expect(result.getMessagesList()[0]).toBe(PIPE_SAMPLE_NEW_ORDER);
  });

  it('handles three distinct concatenated messages, splitting at each BeginString', () => {
    const a = '8=FIX.4.2|9=5|35=0|10=000|';
    const b = '8=FIX.4.2|9=5|35=1|10=000|';
    const c = '8=FIX.4.2|9=5|35=5|10=000|';
    const input = new SplitLogInput();
    input.setRaw(a + b + c);
    const result = splitLog(testContext, input);
    expect(result.getCount()).toBe(3);
    expect(result.getMessagesList()).toEqual([a, b, c]);
  });

  it('returns a structured error for malformed input', () => {
    const input = new SplitLogInput();
    input.setRaw('');
    const result = splitLog(testContext, input);
    expect(result.getOk()).toBe(false);
  });
});
