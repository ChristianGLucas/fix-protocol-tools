import { RawFixMessage } from '../gen/messages_pb';
import { getFixVersion } from './get_fix_version';
import { testContext, PIPE_SAMPLE_NEW_ORDER } from './test_helpers';

describe('GetFixVersion', () => {
  it('identifies FIX.4.2', () => {
    const input = new RawFixMessage();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = getFixVersion(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getFound()).toBe(true);
    expect(result.getBeginString()).toBe('FIX.4.2');
    expect(result.getMajor()).toBe(4);
    expect(result.getMinor()).toBe(2);
  });

  it('identifies FIX.4.4', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.4|9=5|35=0|10=000|');
    const result = getFixVersion(testContext, input);
    expect(result.getMajor()).toBe(4);
    expect(result.getMinor()).toBe(4);
  });

  it('identifies the FIXT.1.1 transport version distinctly', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIXT.1.1|9=5|35=0|10=000|');
    const result = getFixVersion(testContext, input);
    expect(result.getBeginString()).toBe('FIXT.1.1');
    expect(result.getMajor()).toBe(1);
    expect(result.getMinor()).toBe(1);
  });

  it('reports found=false when BeginString is absent', () => {
    const input = new RawFixMessage();
    input.setRaw('35=0|10=000|58=x|');
    const result = getFixVersion(testContext, input);
    expect(result.getFound()).toBe(false);
  });

  it('found=true with major/minor=0 for an unrecognized BeginString shape', () => {
    const input = new RawFixMessage();
    input.setRaw('8=NOTFIX|9=5|35=0|10=000|');
    const result = getFixVersion(testContext, input);
    expect(result.getFound()).toBe(true);
    expect(result.getMajor()).toBe(0);
    expect(result.getMinor()).toBe(0);
  });
});
