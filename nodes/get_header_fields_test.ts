import { RawFixMessage } from '../gen/messages_pb';
import { getHeaderFields } from './get_header_fields';
import { testContext, PIPE_SAMPLE_NEW_ORDER, SAMPLE_BODY_LENGTH } from './test_helpers';

describe('GetHeaderFields', () => {
  it('extracts every standard header field, all present', () => {
    const input = new RawFixMessage();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = getHeaderFields(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getBeginString()).toBe('FIX.4.2');
    expect(result.getBodyLength()).toBe(SAMPLE_BODY_LENGTH);
    expect(result.getMsgType()).toBe('D');
    expect(result.getMsgTypeName()).toBe('NewOrderSingle');
    expect(result.getSenderCompId()).toBe('SENDER');
    expect(result.getTargetCompId()).toBe('TARGET');
    expect(result.getMsgSeqNum()).toBe(1);
    expect(result.getSendingTime()).toBe('20260721-12:00:00');
    expect(result.getMissingFieldsList()).toHaveLength(0);
  });

  it('lists absent header tags in missing_fields rather than guessing a value', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|58=hello|10=000|');
    const result = getHeaderFields(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getMissingFieldsList().sort((a, b) => a - b)).toEqual([34, 35, 49, 52, 56]);
    expect(result.getSenderCompId()).toBe('');
    expect(result.getMsgSeqNum()).toBe(0);
  });
});
