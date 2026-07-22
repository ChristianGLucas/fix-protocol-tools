import { RawFixMessage } from '../gen/messages_pb';
import { parseFields } from './parse_fields';
import { testContext, PIPE_SAMPLE_NEW_ORDER, withSoh } from './test_helpers';

describe('ParseFields', () => {
  it('parses a pipe-delimited message into ordered tag/value pairs', () => {
    const input = new RawFixMessage();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = parseFields(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDelimiterUsed()).toBe('PIPE');
    const fields = result.getFieldsList();
    expect(fields[0].getTag()).toBe(8);
    expect(fields[0].getValue()).toBe('FIX.4.2');
    expect(fields[0].getName()).toBe(''); // ParseFields never decodes names
    const symbolField = fields.find((f) => f.getTag() === 55);
    expect(symbolField?.getValue()).toBe('AAPL');
  });

  it('auto-detects SOH delimiter and parses identically to the pipe version', () => {
    const input = new RawFixMessage();
    input.setRaw(withSoh(PIPE_SAMPLE_NEW_ORDER));
    const result = parseFields(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDelimiterUsed()).toBe('SOH');
    expect(result.getFieldsList()).toHaveLength(15);
  });

  it('respects an explicit delimiter override', () => {
    const input = new RawFixMessage();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    input.setDelimiter('PIPE');
    const result = parseFields(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getDelimiterUsed()).toBe('PIPE');
  });

  it('returns a structured error, not a crash, for a segment with no "="', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|garbage|10=000|');
    const result = parseFields(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
    expect(result.getFieldsList()).toHaveLength(0);
  });

  it('returns a structured error when no delimiter can be detected', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2 9=5 35=D');
    const result = parseFields(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError()).toMatch(/delimiter/);
  });

  it('returns a structured error for empty input', () => {
    const input = new RawFixMessage();
    input.setRaw('');
    const result = parseFields(testContext, input);
    expect(result.getOk()).toBe(false);
  });
});
