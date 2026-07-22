import { GetFieldByTagInput } from '../gen/messages_pb';
import { getFieldByTag } from './get_field_by_tag';
import { testContext, PIPE_SAMPLE_NEW_ORDER } from './test_helpers';

describe('GetFieldByTag', () => {
  it('finds a present tag and attaches its dictionary name', () => {
    const input = new GetFieldByTagInput();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    input.setTag(55);
    const result = getFieldByTag(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(true);
    expect(result.getValue()).toBe('AAPL');
    expect(result.getName()).toBe('Symbol');
  });

  it('reports found=false (not an error) for a tag absent from the message', () => {
    const input = new GetFieldByTagInput();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    input.setTag(9999);
    const result = getFieldByTag(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(false);
  });

  it('returns an empty name for a tag not in the embedded dictionary', () => {
    const input = new GetFieldByTagInput();
    input.setRaw('8=FIX.4.2|9=5|35=D|9999=custom|10=000|');
    input.setTag(9999);
    const result = getFieldByTag(testContext, input);
    expect(result.getFound()).toBe(true);
    expect(result.getValue()).toBe('custom');
    expect(result.getName()).toBe('');
  });
});
