import { RawFixMessage } from '../gen/messages_pb';
import { countFields } from './count_fields';
import { testContext, PIPE_SAMPLE_NEW_ORDER } from './test_helpers';

describe('CountFields', () => {
  it('reports equal total and unique counts when no tag repeats', () => {
    const input = new RawFixMessage();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = countFields(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getTotalFields()).toBe(15);
    expect(result.getUniqueTags()).toBe(15);
  });

  it('reports total > unique when a tag repeats', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|58=a|35=D|58=b|58=c|10=000|');
    const result = countFields(testContext, input);
    expect(result.getTotalFields()).toBe(7);
    expect(result.getUniqueTags()).toBe(5);
  });
});
