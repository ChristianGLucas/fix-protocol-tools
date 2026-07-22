import { ComputeCheckSumInput } from '../gen/messages_pb';
import { computeCheckSum } from './compute_check_sum';
import { testContext, PIPE_SAMPLE_NEW_ORDER, SAMPLE_CHECKSUM_PIPE, SAMPLE_CHECKSUM_SOH, withSoh } from './test_helpers';

// SAMPLE_CHECKSUM_PIPE ("093") and SAMPLE_CHECKSUM_SOH ("163") are
// independently (Python, byte-sum-mod-256) computed oracle values for the
// SAME field content in its two literal byte forms — see test_helpers.ts
// for why they legitimately differ (CheckSum is delimiter-byte-literal).
describe('ComputeCheckSum', () => {
  it('computes the correct checksum, stripping the existing (correct) tag-10 field first', () => {
    const input = new ComputeCheckSumInput();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = computeCheckSum(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getChecksum()).toBe(SAMPLE_CHECKSUM_PIPE);
  });

  it('computes the same correct checksum even if the input carries a WRONG existing tag-10', () => {
    const wrong = PIPE_SAMPLE_NEW_ORDER.replace('10=093|', '10=001|');
    const input = new ComputeCheckSumInput();
    input.setRaw(wrong);
    const result = computeCheckSum(testContext, input);
    expect(result.getChecksum()).toBe(SAMPLE_CHECKSUM_PIPE);
  });

  it('computes the independently-verified DIFFERENT checksum for the real-SOH-delimited form of the same content', () => {
    const input = new ComputeCheckSumInput();
    input.setRaw(withSoh(PIPE_SAMPLE_NEW_ORDER));
    const result = computeCheckSum(testContext, input);
    expect(result.getChecksum()).toBe(SAMPLE_CHECKSUM_SOH);
    expect(result.getChecksum()).not.toBe(SAMPLE_CHECKSUM_PIPE);
  });

  it('is always exactly 3 zero-padded digits, even for a small sum', () => {
    // A minimal body whose byte sum mod 256 is small forces zero-padding.
    const input = new ComputeCheckSumInput();
    input.setRaw('8=A|9=1|');
    const result = computeCheckSum(testContext, input);
    expect(result.getChecksum()).toMatch(/^\d{3}$/);
  });
});
