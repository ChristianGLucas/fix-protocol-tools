// Shared test scaffolding for every *_test.ts in this package — one
// AxiomContext test double, reused rather than duplicated 18 times.
import { AxiomContext, AxiomLogger, AxiomSecrets, AxiomReflection, AxiomMutation } from '../gen/axiomContext';

const testReflection: AxiomReflection = {
  flow: {
    nodes: [],
    edges: [],
    loopEdges: [],
    position: { currentInstance: 0, depth: 0, loopIterations: {}, subflowStackGraphIds: [] },
    graphId: '',
  },
};

const testMutation: AxiomMutation = {
  flow: {
    addNode: (_packageName: string, _packageVersion: string) => 0,
    addEdge: (_srcInstance: number, _dstInstance: number) => {},
  },
};

export const testContext: AxiomContext = {
  log: {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
  } satisfies AxiomLogger,
  secrets: {
    get: (_name: string): [string, boolean] => ['', false],
  } satisfies AxiomSecrets,
  executionId: 'test-execution-id',
  flowId: 'test-flow-id',
  tenantId: 'test-tenant-id',
  reflection: testReflection,
  mutation: testMutation,
};

// A real, well-formed FIX 4.2 NewOrderSingle example whose BodyLength and
// CheckSum were computed INDEPENDENTLY of this package's own implementation
// -- via a standalone Python script summing raw UTF-8 bytes per the FIX spec
// algorithm, not by calling compute_check_sum.ts / validate_body_length.ts
// -- so tests asserting against these constants are a genuine
// independent-oracle check, not self-consistency of our own code.
//
// A real bug this independent check surfaced during authoring: CheckSum
// sums the LITERAL bytes of the message, and SOH (0x01) and '|' (0x7C) are
// different byte values -- so a message's CheckSum is delimiter-byte-
// literal, NOT invariant under pipe<->SOH substitution, even though the two
// render as "the same" message. (BodyLength, by contrast, IS invariant
// here: SOH and '|' are both exactly 1 byte, so substituting one for the
// other never changes a byte count -- though it would if CARET's 2-byte
// "^A" delimiter were involved.) This package computes CheckSum/BodyLength
// over exactly the bytes it is given, which is the only sound, delimiter-
// agnostic behavior -- see the ComputeCheckSum / ValidateCheckSum docs.

// BodyLength = 109 (delimiter-width-invariant: true for both the '|' and
// the real-SOH forms below, since both delimiters are exactly 1 byte).
export const SAMPLE_BODY_LENGTH = 109;

// CheckSum of the fields below AS PIPE-DELIMITED BYTES (declared inline as
// "10=093", matching its own literal content).
export const PIPE_SAMPLE_NEW_ORDER =
  '8=FIX.4.2|9=109|35=D|49=SENDER|56=TARGET|34=1|52=20260721-12:00:00|11=CL1|21=1|55=AAPL|54=1|60=20260721-12:00:00|38=100|40=2|10=093|';
export const SAMPLE_CHECKSUM_PIPE = '093';

// CheckSum of the SAME field content AS REAL-SOH-DELIMITED BYTES (via
// withSoh() below) -- deliberately a DIFFERENT value than
// SAMPLE_CHECKSUM_PIPE, for the reason explained above. Independently
// verified in Python against the actual 0x01-joined byte string, not
// derived from the pipe checksum.
export const SAMPLE_CHECKSUM_SOH = '163';

/** Replaces every '|' delimiter with the real FIX SOH byte (0x01). */
export function withSoh(pipeDelimited: string): string {
  return pipeDelimited.split('|').join('\x01');
}
