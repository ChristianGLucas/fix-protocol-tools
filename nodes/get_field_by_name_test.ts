import { GetFieldByNameInput } from '../gen/messages_pb';
import { getFieldByName } from './get_field_by_name';
import { testContext, PIPE_SAMPLE_NEW_ORDER } from './test_helpers';

describe('GetFieldByName', () => {
  it('finds a field by its dictionary name', () => {
    const input = new GetFieldByNameInput();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    input.setFieldName('Symbol');
    const result = getFieldByName(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(true);
    expect(result.getTag()).toBe(55);
    expect(result.getValue()).toBe('AAPL');
  });

  it('is case-insensitive', () => {
    const input = new GetFieldByNameInput();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    input.setFieldName('sYmBoL');
    const result = getFieldByName(testContext, input);
    expect(result.getFound()).toBe(true);
    expect(result.getValue()).toBe('AAPL');
  });

  it('reports found=false for a name not in the dictionary', () => {
    const input = new GetFieldByNameInput();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    input.setFieldName('TotallyNotAFixField');
    const result = getFieldByName(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(false);
  });

  it('reports found=false for a recognized name whose tag is absent from this message', () => {
    const input = new GetFieldByNameInput();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    input.setFieldName('Price'); // tag 44, not present in the sample order
    const result = getFieldByName(testContext, input);
    expect(result.getFound()).toBe(false);
  });
});
