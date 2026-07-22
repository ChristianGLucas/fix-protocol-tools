import { ExtractGroupInput } from '../gen/messages_pb';
import { extractRepeatingGroup } from './extract_repeating_group';
import { testContext } from './test_helpers';

const TWO_PARTY_GROUP =
  '8=FIX.4.2|9=5|35=D|453=2|448=BROKER1|447=D|452=1|448=BROKER2|447=D|452=1|10=000|';

describe('ExtractRepeatingGroup', () => {
  it('extracts a 2-entry NoPartyIDs(453) group using the delimiter-tag heuristic', () => {
    const input = new ExtractGroupInput();
    input.setRaw(TWO_PARTY_GROUP);
    input.setCountTag(453);
    const result = extractRepeatingGroup(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(true);
    expect(result.getDeclaredCount()).toBe(2);
    const entries = result.getEntriesList();
    expect(entries).toHaveLength(2);
    expect(entries[0].getFieldsList().map((f) => [f.getTag(), f.getValue()])).toEqual([
      [448, 'BROKER1'],
      [447, 'D'],
      [452, '1'],
    ]);
    expect(entries[1].getFieldsList().map((f) => [f.getTag(), f.getValue()])).toEqual([
      [448, 'BROKER2'],
      [447, 'D'],
      [452, '1'],
    ]);
  });

  it('reports found=false when the count tag is absent', () => {
    const input = new ExtractGroupInput();
    input.setRaw('8=FIX.4.2|9=5|35=D|58=hi|10=000|');
    input.setCountTag(453);
    const result = extractRepeatingGroup(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(false);
    expect(result.getDeclaredCount()).toBe(0);
    expect(result.getEntriesList()).toHaveLength(0);
  });

  it('returns zero entries for a declared count of 0 (a legitimately empty group)', () => {
    const input = new ExtractGroupInput();
    input.setRaw('8=FIX.4.2|9=5|35=D|453=0|10=000|');
    input.setCountTag(453);
    const result = extractRepeatingGroup(testContext, input);
    expect(result.getFound()).toBe(true);
    expect(result.getDeclaredCount()).toBe(0);
    expect(result.getEntriesList()).toHaveLength(0);
  });
});
