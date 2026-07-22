import { RawFixMessage, CheckSumValidationOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseFieldsCore, findField, computeChecksum, FixInputError } from './fix_helpers';

/**
 * Validates that the declared CheckSum (tag 10) matches the checksum
 * computed over the message per the FIX spec algorithm: the sum, modulo
 * 256, of every raw byte from the start of the message up to (but not
 * including) the "10=" field, formatted as a zero-padded 3-digit decimal
 * string. `valid` is false whenever they differ, including when tag 10 is
 * absent (`declared_checksum` is then empty).
 *
 * IMPORTANT: the checksum is computed over the LITERAL bytes of the input
 * you supply, including its delimiter — SOH (0x01) and '|' are different
 * byte values, so re-rendering a message from real SOH bytes to '|' (or
 * vice versa) without recomputing its trailer changes what the correct
 * checksum is, and validation against the OLD trailer will then correctly
 * report invalid. This is not a bug — see ComputeCheckSum's docs.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateCheckSum(ax: AxiomContext, input: RawFixMessage): CheckSumValidationOutput {
  const out = new CheckSumValidationOutput();
  try {
    const parsed = parseFieldsCore(input.getRaw() || '', input.getDelimiter());
    const declared = findField(parsed.fields, 10) || '';
    const computed = computeChecksum(parsed.fields, parsed.delimiterChars);

    out.setOk(true);
    out.setError('');
    out.setDeclaredChecksum(declared);
    out.setComputedChecksum(computed);
    out.setValid(declared !== '' && declared === computed);
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof FixInputError ? err.message : String(err));
  }
  return out;
}
