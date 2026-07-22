import { GetFieldByTagInput, FieldValueOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, findField, FixInputError } from './fix_helpers';
import { FIELD_NAMES } from './fix_dictionary';

/**
 * Gets the value of one field by its numeric FIX tag (e.g. tag 55 for
 * Symbol). `found` is false when the message parses fine but the tag isn't
 * present — that is not an error. `name` is filled from the embedded FIX
 * data dictionary when known, empty otherwise.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getFieldByTag(ax: AxiomContext, input: GetFieldByTagInput): FieldValueOutput {
  const out = new FieldValueOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    const tag = input.getTag();
    const value = findField(parsed.fields, tag);
    out.setOk(true);
    out.setError('');
    if (value === undefined) {
      out.setFound(false);
    } else {
      out.setFound(true);
      out.setTag(tag);
      out.setValue(value);
      out.setName(FIELD_NAMES[tag] || '');
    }
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
