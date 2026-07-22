import { RawFixMessage, FieldCountOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, FixInputError } from './fix_helpers';

/**
 * Counts total field occurrences in the message (including tags that
 * repeat, e.g. inside repeating groups) versus the count of distinct tag
 * numbers. total_fields === unique_tags means no tag repeats;
 * total_fields > unique_tags means at least one does (a signal that
 * repeating groups may be present — see ExtractRepeatingGroup).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function countFields(ax: AxiomContext, input: RawFixMessage): FieldCountOutput {
  const out = new FieldCountOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    const uniqueTags = new Set(parsed.fields.map((f) => f.tag)).size;
    out.setOk(true);
    out.setError('');
    out.setTotalFields(parsed.fields.length);
    out.setUniqueTags(uniqueTags);
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
