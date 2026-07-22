import { DecodeEnumInput } from '../gen/messages_pb';
import { decodeEnumValue } from './decode_enum_value';
import { testContext } from './test_helpers';

describe('DecodeEnumValue', () => {
  it('decodes Side (54) "1" to "Buy"', () => {
    const input = new DecodeEnumInput();
    input.setTag(54);
    input.setValue('1');
    const result = decodeEnumValue(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(true);
    expect(result.getMeaning()).toBe('Buy');
  });

  it('decodes OrdType (40) "2" to "Limit"', () => {
    const input = new DecodeEnumInput();
    input.setTag(40);
    input.setValue('2');
    const result = decodeEnumValue(testContext, input);
    expect(result.getMeaning()).toBe('Limit');
  });

  it('decodes a Y/N boolean flag tag (43, PossDupFlag) to Yes/No', () => {
    const y = new DecodeEnumInput();
    y.setTag(43);
    y.setValue('Y');
    expect(decodeEnumValue(testContext, y).getMeaning()).toBe('Yes');

    const n = new DecodeEnumInput();
    n.setTag(43);
    n.setValue('N');
    expect(decodeEnumValue(testContext, n).getMeaning()).toBe('No');
  });

  it('reports found=false for a tag with no known enum table', () => {
    const input = new DecodeEnumInput();
    input.setTag(58); // Text — free text, not enumerated
    input.setValue('anything');
    const result = decodeEnumValue(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(false);
  });

  it('reports found=false for a value not present in a known enum table', () => {
    const input = new DecodeEnumInput();
    input.setTag(54);
    input.setValue('Z');
    const result = decodeEnumValue(testContext, input);
    expect(result.getFound()).toBe(false);
  });
});
