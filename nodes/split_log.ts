import { SplitLogInput, SplitLogOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { splitLogCore, FixInputError } from './fix_helpers';

/**
 * Splits a FIX LOG — one or more complete FIX messages concatenated
 * back-to-back, as commonly found in session/application log files — into
 * individual message strings. A new message is detected wherever a
 * BeginString (tag 8) field starts, after the first one. Assumes the whole
 * log uses one consistent delimiter throughout (auto-detected, or
 * overridden via `delimiter`).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function splitLog(ax: AxiomContext, input: SplitLogInput): SplitLogOutput {
  const out = new SplitLogOutput();
  try {
    const { messages } = splitLogCore(input.getRaw() || '', input.getDelimiter());
    out.setOk(true);
    out.setError('');
    out.setMessagesList(messages);
    out.setCount(messages.length);
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
