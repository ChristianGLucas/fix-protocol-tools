import { RawFixMessage } from '../gen/messages_pb';
import { validateBodyLength } from './validate_body_length';
import { testContext, PIPE_SAMPLE_NEW_ORDER, SAMPLE_BODY_LENGTH, withSoh } from './test_helpers';

// SAMPLE_BODY_LENGTH (109) was computed by a standalone Python script
// (summing UTF-8 bytes per the FIX spec's BodyLength definition), NOT by
// calling this package's own code — see test_helpers.ts. Asserting against
// it here is a genuine independent-oracle check.
describe('ValidateBodyLength', () => {
  it('validates a correct declared BodyLength against the independently-computed value', () => {
    const input = new RawFixMessage();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = validateBodyLength(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDeclaredBodyLength()).toBe(SAMPLE_BODY_LENGTH);
    expect(result.getActualBodyLength()).toBe(SAMPLE_BODY_LENGTH);
    expect(result.getValid()).toBe(true);
  });

  it('agrees on the SOH-delimited form of the same message', () => {
    const input = new RawFixMessage();
    input.setRaw(withSoh(PIPE_SAMPLE_NEW_ORDER));
    const result = validateBodyLength(testContext, input);
    expect(result.getActualBodyLength()).toBe(SAMPLE_BODY_LENGTH);
    expect(result.getValid()).toBe(true);
  });

  it('detects a wrong declared BodyLength', () => {
    const wrong = PIPE_SAMPLE_NEW_ORDER.replace('9=109|', '9=999|');
    const input = new RawFixMessage();
    input.setRaw(wrong);
    const result = validateBodyLength(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDeclaredBodyLength()).toBe(999);
    expect(result.getActualBodyLength()).toBe(SAMPLE_BODY_LENGTH);
    expect(result.getValid()).toBe(false);
  });
});
