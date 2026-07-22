import { RawFixMessage } from '../gen/messages_pb';
import { listTags } from './list_tags';
import { testContext, PIPE_SAMPLE_NEW_ORDER } from './test_helpers';

describe('ListTags', () => {
  it('lists every distinct tag in order of first appearance', () => {
    const input = new RawFixMessage();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = listTags(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getTagsList()).toEqual([8, 9, 35, 49, 56, 34, 52, 11, 21, 55, 54, 60, 38, 40, 10]);
    expect(result.getUniqueCount()).toBe(15);
  });

  it('deduplicates a tag that repeats, keeping only its first-appearance position', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|58=a|35=D|58=b|10=000|');
    const result = listTags(testContext, input);
    expect(result.getTagsList()).toEqual([8, 9, 58, 35, 10]);
    expect(result.getUniqueCount()).toBe(5);
  });
});
