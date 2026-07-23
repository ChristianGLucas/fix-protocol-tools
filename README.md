# fix-protocol-tools

Deterministic parsing, decoding, and integrity validation of **FIX** (Financial
Information eXchange) protocol messages — FIX 4.2/4.4/5.0, the dominant
electronic-trading messaging standard. Built for the [Axiom](https://axiomide.com)
marketplace, published under the `christiangeorgelucas` handle.

A FIX message is a SOH-delimited (`0x01`, often shown as `|` or `^A`) sequence
of `tag=value` fields, e.g.:

```
8=FIX.4.2|9=178|35=D|55=AAPL|54=1|38=100|44=25.50|10=123
```

This package tokenizes that wire format and pairs it with an **embedded FIX
data dictionary** — tag number to field name, message-type codes, and
enumerated field-value meanings, hand-compiled from the public FIX 4.2/4.4
specification — to decode messages, extract and validate the standard header
and common order fields, extract repeating groups, and verify the
BodyLength/CheckSum wire-integrity fields.

Every node is a pure, deterministic single-input to single-output transform:
no network, no FIX session/socket, no wall-clock, no randomness. The FIX
message is always supplied as text by the caller.

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/fix-protocol-tools@0.1.0

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/fix-protocol-tools/ParseFields --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/fix-protocol-tools/0.1.0/ParseFields \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/fix-protocol-tools/ParseFields`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

## Nodes

- **ParseFields** — parse a message into an ordered list of `{tag, value}` fields (SOH/`|`/`^A`).
- **ParseToMap** — parse a message into a `tag -> value` map.
- **GetFieldByTag** — get one field's value by its numeric tag.
- **GetFieldByName** — get one field's value by its dictionary name (e.g. `"Symbol"`).
- **DecodeMessage** — decode a message with human-readable field names attached.
- **GetMsgType** — extract and decode MsgType (tag 35), e.g. `"D"` -> `"NewOrderSingle"`.
- **GetHeaderFields** — extract the standard header (8/9/35/49/56/34/52).
- **GetOrderFields** — extract and decode common order fields (55/54/38/44/40/59).
- **DecodeEnumValue** — decode any tag/value pair to its enumerated meaning.
- **ValidateBodyLength** — validate declared BodyLength (tag 9) against the actual byte length.
- **ValidateCheckSum** — validate declared CheckSum (tag 10) against the computed value.
- **ComputeCheckSum** — compute the correct CheckSum for a message body.
- **SplitLog** — split a concatenated FIX log into individual messages.
- **ExtractRepeatingGroup** — extract a repeating group (e.g. NoMDEntries) as structured entries.
- **GetFixVersion** — identify the FIX protocol version from BeginString.
- **ListTags** — list every distinct tag present.
- **CountFields** — count total field occurrences vs. distinct tags.
- **ClassifyMessage** — classify a message as admin, application, or unknown.

## Notes on CheckSum

CheckSum is computed over the **literal bytes** of the input you supply,
including its delimiter. SOH (`0x01`) and `|` are different byte values, so
the same logical message rendered with `|` instead of a real SOH byte has a
genuinely different checksum. If you need the checksum that would appear on
the real wire, supply the real SOH-delimited bytes.

## License

MIT — Copyright (c) 2026 Christian George Lucas.
