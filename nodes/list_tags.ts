import { RawFixMessage, TagListOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, FixInputError } from './fix_helpers';

/**
 * Lists every distinct tag number present in the message, in order of
 * first appearance (no duplicates), plus how many unique tags that is.
 * Use CountFields alongside this to see whether any tag repeats (e.g.
 * inside a repeating group): total_fields > unique tag count means yes.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listTags(ax: AxiomContext, input: RawFixMessage): TagListOutput {
  const out = new TagListOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    const seen = new Set<number>();
    const tags: number[] = [];
    for (const f of parsed.fields) {
      if (!seen.has(f.tag)) {
        seen.add(f.tag);
        tags.push(f.tag);
      }
    }
    out.setOk(true);
    out.setError('');
    out.setTagsList(tags);
    out.setUniqueCount(tags.length);
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
