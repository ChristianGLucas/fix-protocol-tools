import { RawFixMessage, FieldMapOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, FixInputError } from './fix_helpers';

/**
 * Parses a raw FIX message into a tag(string)->value map. Because a map
 * collapses duplicate keys, a tag that repeats on the wire (legitimate
 * inside repeating groups) is represented here by its LAST occurrence only
 * — `duplicate_tags` lists which tag numbers this happened to, as a signal
 * that the map view lost information for them; use ParseFields (ordered
 * list) or ExtractRepeatingGroup when duplicate/grouped tags matter.
 * Returns ok=false with a structured error for malformed input.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseToMap(ax: AxiomContext, input: RawFixMessage): FieldMapOutput {
  const out = new FieldMapOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    const seen = new Set<number>();
    const duplicates = new Set<number>();
    const map = out.getFieldsMap();
    for (const f of parsed.fields) {
      if (seen.has(f.tag)) duplicates.add(f.tag);
      seen.add(f.tag);
      map.set(String(f.tag), f.value);
    }
    out.setOk(true);
    out.setError('');
    out.setDuplicateTagsList(Array.from(duplicates).sort((a, b) => a - b));
    out.setDelimiterUsed(parsed.delimiterName);
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
