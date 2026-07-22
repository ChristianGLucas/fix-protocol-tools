import { DecodeEnumInput, EnumDecodeOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { decodeEnumValue as lookupEnum } from './fix_dictionary';

/**
 * Decodes one already-extracted tag/value pair (e.g. from ParseFields) to
 * its enumerated meaning using the embedded FIX dictionary — e.g. tag 54
 * value "1" -> "Buy", tag 40 value "2" -> "Limit". Works for any tag the
 * dictionary has an enum table for, including the Y/N boolean-flag fields
 * (decoded as "Yes"/"No"). `found` is false — not an error — when the tag
 * has no known enum table, or the value isn't in that table (many FIX
 * fields are free text or numeric, not enumerated).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function decodeEnumValue(ax: AxiomContext, input: DecodeEnumInput): EnumDecodeOutput {
  const out = new EnumDecodeOutput();
  const meaning = lookupEnum(input.getTag(), input.getValue() || '');
  out.setOk(true);
  out.setError('');
  if (meaning === null) {
    out.setFound(false);
    out.setMeaning('');
  } else {
    out.setFound(true);
    out.setMeaning(meaning);
  }
  return out;
}
