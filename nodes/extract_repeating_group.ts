import { ExtractGroupInput, RepeatingGroupOutput, FixFieldGroup } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, toFixFields, FixInputError } from './fix_helpers';

/**
 * Extracts a FIX repeating group as a structured array of entries.
 * `count_tag` is the group's NoXXX counter tag (e.g. 268 for NoMDEntries,
 * 453 for NoPartyIDs, 73 for NoOrders). Uses the standard schema-less
 * delimiter-tag heuristic — no group dictionary is required: the tag
 * immediately following the counter field starts each entry, and every
 * subsequent occurrence of that same tag begins a new entry; grouping ends
 * at the CheckSum (tag 10) trailer or end of message.
 *
 * KNOWN LIMITATION (schema-less extraction): if one or more non-group
 * top-level fields follow the repeating group before the trailer, this
 * heuristic has no way to distinguish them from the group's own fields and
 * they are absorbed into the last entry. This is correct for the common
 * case — a repeating group followed only by the CheckSum trailer.
 *
 * `found` is false if `count_tag` is absent from the message.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractRepeatingGroup(ax: AxiomContext, input: ExtractGroupInput): RepeatingGroupOutput {
  const out = new RepeatingGroupOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    const countTag = input.getCountTag();
    const countIdx = parsed.fields.findIndex((f) => f.tag === countTag);

    out.setOk(true);
    out.setError('');

    if (countIdx === -1) {
      out.setFound(false);
      out.setDeclaredCount(0);
      return out;
    }

    const declaredCountRaw = parsed.fields[countIdx].value;
    const declaredCount = /^\d+$/.test(declaredCountRaw) ? Number(declaredCountRaw) : 0;
    out.setFound(true);
    out.setDeclaredCount(declaredCount);

    const rest = parsed.fields.slice(countIdx + 1).filter((f) => f.tag !== 10);
    if (rest.length === 0 || declaredCount === 0) {
      return out;
    }
    const delimiterTag = rest[0].tag;
    const entries: (typeof rest)[] = [];
    let current: typeof rest = [];
    for (const f of rest) {
      if (f.tag === delimiterTag && current.length > 0) {
        entries.push(current);
        current = [];
      }
      current.push(f);
    }
    if (current.length > 0) entries.push(current);

    for (const entryFields of entries) {
      const group = new FixFieldGroup();
      group.setFieldsList(toFixFields(entryFields));
      out.addEntries(group);
    }
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
