import { RawFixMessage } from '../gen/messages_pb';
import { parseToMap } from './parse_to_map';
import { testContext, PIPE_SAMPLE_NEW_ORDER } from './test_helpers';

describe('ParseToMap', () => {
  it('parses fields into a tag->value map', () => {
    const input = new RawFixMessage();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = parseToMap(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFieldsMap().get('55')).toBe('AAPL');
    expect(result.getFieldsMap().get('35')).toBe('D');
    expect(result.getDuplicateTagsList()).toHaveLength(0);
  });

  it('collapses a repeated tag to its LAST occurrence and reports it as a duplicate', () => {
    const input = new RawFixMessage();
    // Tag 58 (Text) appears twice with different values.
    input.setRaw('8=FIX.4.2|9=5|35=D|58=first|58=second|10=000|');
    const result = parseToMap(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFieldsMap().get('58')).toBe('second');
    expect(result.getDuplicateTagsList()).toEqual([58]);
  });

  it('returns a structured error for malformed input', () => {
    const input = new RawFixMessage();
    input.setRaw('not-a-fix-message-at-all');
    const result = parseToMap(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });
});
