import { RawFixMessage, OrderFieldsOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, findField, FixInputError } from './fix_helpers';
import { decodeEnumValue } from './fix_dictionary';

/**
 * Extracts the common order-related fields, decoded: Symbol(55),
 * Side(54, plus its decoded name e.g. "Buy"), OrderQty(38), Price(44),
 * OrdType(40, plus its decoded name e.g. "Limit"), TimeInForce(59, plus
 * its decoded name e.g. "Day"). OrderQty and Price are kept as the exact
 * wire strings — FIX numeric fields are decimal text, and parsing them as
 * a float risks precision loss — parse them yourself if you need a number.
 * A field absent from the message has its tag number in `missing_fields`.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getOrderFields(ax: AxiomContext, input: RawFixMessage): OrderFieldsOutput {
  const out = new OrderFieldsOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    const missing: number[] = [];

    const symbol = findField(parsed.fields, 55);
    if (symbol === undefined) missing.push(55);
    out.setSymbol(symbol || '');

    const side = findField(parsed.fields, 54);
    if (side === undefined) missing.push(54);
    out.setSide(side || '');
    out.setSideName(side !== undefined ? decodeEnumValue(54, side) || '' : '');

    const orderQty = findField(parsed.fields, 38);
    if (orderQty === undefined) missing.push(38);
    out.setOrderQty(orderQty || '');

    const price = findField(parsed.fields, 44);
    if (price === undefined) missing.push(44);
    out.setPrice(price || '');

    const ordType = findField(parsed.fields, 40);
    if (ordType === undefined) missing.push(40);
    out.setOrdType(ordType || '');
    out.setOrdTypeName(ordType !== undefined ? decodeEnumValue(40, ordType) || '' : '');

    const tif = findField(parsed.fields, 59);
    if (tif === undefined) missing.push(59);
    out.setTimeInForce(tif || '');
    out.setTimeInForceName(tif !== undefined ? decodeEnumValue(59, tif) || '' : '');

    out.setOk(true);
    out.setError('');
    out.setMissingFieldsList(missing);
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
