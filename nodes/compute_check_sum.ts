import { ComputeCheckSumInput, ComputeCheckSumOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, computeChecksum, FixInputError } from './fix_helpers';

/**
 * Computes the correct FIX CheckSum for a message: the sum, modulo 256, of
 * every raw byte from the start of the message up to (but not including)
 * the "10=" (CheckSum) field, formatted as a zero-padded 3-digit decimal
 * string (e.g. "062"). If the input already contains a trailing "10=nnn"
 * field it is stripped before computing — per the spec, CheckSum is never
 * computed over itself — so this can be called on a message with or
 * without an existing (possibly wrong) checksum.
 *
 * IMPORTANT: the checksum is computed over the LITERAL bytes of the input
 * you supply, including its delimiter. SOH (0x01) and '|' are different
 * byte values, so the same logical message rendered with '|' instead of a
 * real SOH byte has a genuinely DIFFERENT checksum — this is not a bug,
 * it's what "sum of the raw bytes" means. If you need the checksum that
 * would appear on the real wire, supply the real SOH-delimited bytes.
 *

 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function computeCheckSum(ax: AxiomContext, input: ComputeCheckSumInput): ComputeCheckSumOutput {
  const out = new ComputeCheckSumOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    out.setOk(true);
    out.setError('');
    out.setChecksum(computeChecksum(parsed.fields, parsed.delimiterChars));
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
