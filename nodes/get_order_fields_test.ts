import { RawFixMessage } from '../gen/messages_pb';
import { getOrderFields } from './get_order_fields';
import { testContext, PIPE_SAMPLE_NEW_ORDER } from './test_helpers';

describe('GetOrderFields', () => {
  it('extracts and decodes the common order fields present in the sample', () => {
    const input = new RawFixMessage();
    input.setRaw(PIPE_SAMPLE_NEW_ORDER);
    const result = getOrderFields(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getSymbol()).toBe('AAPL');
    expect(result.getSide()).toBe('1');
    expect(result.getSideName()).toBe('Buy');
    expect(result.getOrderQty()).toBe('100');
    expect(result.getOrdType()).toBe('2');
    expect(result.getOrdTypeName()).toBe('Limit');
    // The sample order has no Price(44) or TimeInForce(59) — both are
    // legitimately absent (a Limit order without Price would be rejected by
    // a real venue, but this package validates syntax, not business rules).
    expect(result.getPrice()).toBe('');
    expect(result.getTimeInForce()).toBe('');
    expect(result.getMissingFieldsList().sort((a, b) => a - b)).toEqual([44, 59]);
  });

  it('keeps OrderQty and Price as exact wire strings (no float parsing)', () => {
    const input = new RawFixMessage();
    input.setRaw('8=FIX.4.2|9=5|35=D|55=EURUSD|54=2|38=100.50|44=1.23456789|40=2|10=000|');
    const result = getOrderFields(testContext, input);
    expect(result.getOrderQty()).toBe('100.50');
    expect(result.getPrice()).toBe('1.23456789');
    expect(result.getSideName()).toBe('Sell');
  });
});
