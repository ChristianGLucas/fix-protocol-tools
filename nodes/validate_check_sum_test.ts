import { RawFixMessage } from '../gen/messages_pb';
import { validateCheckSum } from './validate_check_sum';
import { testContext, PIPE_SAMPLE_NEW_ORDER, SAMPLE_CHECKSUM_PIPE, SAMPLE_CHECKSUM_SOH, withSoh } from './test_helpers';

// SAMPLE_CHECKSUM_PIPE ("093") / SAMPLE_CHECKSUM_SOH ("163") were computed
// by a standalone Python script (byte sum mod 256 per the FIX spec's
// CheckSum algorithm), NOT by calling this package's own code — see
// test_helpers.ts. Asserting against them is a genuine independent-oracle
// check, not self-consistency.
describe('ValidateCheckSum', () => {
  it('validates a correct declared CheckSum against the independently-computed value', () => {
    const input = new RawFixMessage();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = validateCheckSum(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDeclaredChecksum()).toBe(SAMPLE_CHECKSUM_PIPE);
    expect(result.getComputedChecksum()).toBe(SAMPLE_CHECKSUM_PIPE);
    expect(result.getValid()).toBe(true);
  });

  it('computes the independently-verified DIFFERENT checksum for the real-SOH form (declared value now stale, so invalid)', () => {
    // withSoh() only swaps the delimiter bytes; the trailer's declared
    // "093" is left as literal characters, but the correct checksum for
    // real-SOH bytes is "163" (see test_helpers.ts) — so this SPECIFIC
    // conversion is legitimately invalid, and that is exactly what we assert.
    const input = new RawFixMessage();
    input.setRaw(withSoh(PIPE_SAMPLE_NEW_ORDER));
    const result = validateCheckSum(testContext, input);
    expect(result.getComputedChecksum()).toBe(SAMPLE_CHECKSUM_SOH);
    expect(result.getDeclaredChecksum()).toBe(SAMPLE_CHECKSUM_PIPE);
    expect(result.getValid()).toBe(false);
  });

  it('validates a genuine real-SOH message whose trailer was computed for SOH bytes', () => {
    const soh = withSoh(PIPE_SAMPLE_NEW_ORDER).replace(SAMPLE_CHECKSUM_PIPE, SAMPLE_CHECKSUM_SOH);
    const input = new RawFixMessage();
    input.setRaw(soh);
    const result = validateCheckSum(testContext, input);
    expect(result.getComputedChecksum()).toBe(SAMPLE_CHECKSUM_SOH);
    expect(result.getDeclaredChecksum()).toBe(SAMPLE_CHECKSUM_SOH);
    expect(result.getValid()).toBe(true);
  });

  it('detects a wrong declared CheckSum', () => {
    const wrong = PIPE_SAMPLE_NEW_ORDER.replace('10=093|', '10=999|');
    const input = new RawFixMessage();
    input.setRaw(wrong);
    const result = validateCheckSum(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDeclaredChecksum()).toBe('999');
    expect(result.getComputedChecksum()).toBe(SAMPLE_CHECKSUM_PIPE);
    expect(result.getValid()).toBe(false);
  });

  it('reports invalid, with an empty declared checksum, when tag 10 is absent', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|35=D|58=hi|');
    const result = validateCheckSum(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDeclaredChecksum()).toBe('');
    expect(result.getValid()).toBe(false);
  });
});
