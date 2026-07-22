import { RawFixMessage, FixVersionOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, findField, parseFixVersion, FixInputError } from './fix_helpers';

/**
 * Identifies the FIX protocol version from BeginString (tag 8), e.g.
 * "FIX.4.2" -> major=4, minor=2. FIXT.1.1 (the FIX 5.0+ transport-layer
 * version string) is reported as major=1, minor=1 with the full
 * begin_string preserved. `found` is false if tag 8 is absent; if present
 * but not shaped like "FIX(T).<major>.<minor>", `found` is true but
 * major/minor are both 0 (still a valid tag value, just not a version
 * string this package recognizes).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getFixVersion(ax: AxiomContext, input: RawFixMessage): FixVersionOutput {
  const out = new FixVersionOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    const beginString = findField(parsed.fields, 8);
    out.setOk(true);
    out.setError('');
    if (beginString === undefined) {
      out.setFound(false);
      return out;
    }
    out.setFound(true);
    out.setBeginString(beginString);
    const version = parseFixVersion(beginString);
    out.setMajor(version.major);
    out.setMinor(version.minor);
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
