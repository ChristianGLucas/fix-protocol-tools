import { GetFieldByNameInput, FieldValueOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, findField, tagForName, FixInputError } from './fix_helpers';
import { FIELD_NAMES } from './fix_dictionary';

/**
 * Gets the value of one field by its FIX dictionary field NAME (e.g.
 * "Symbol" for tag 55), case-insensitive. `found` is false both when the
 * name isn't a recognized dictionary field and when it is recognized but
 * the tag isn't present in this message — neither is an error.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getFieldByName(ax: AxiomContext, input: GetFieldByNameInput): FieldValueOutput {
  const out = new FieldValueOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    const tag = tagForName(input.getFieldName() || '');
    out.setOk(true);
    out.setError('');
    if (tag === undefined) {
      out.setFound(false);
      return out;
    }
    const value = findField(parsed.fields, tag);
    if (value === undefined) {
      out.setFound(false);
    } else {
      out.setFound(true);
      out.setTag(tag);
      out.setValue(value);
      out.setName(FIELD_NAMES[tag] || input.getFieldName());
    }
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
