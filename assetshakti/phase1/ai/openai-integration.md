# AssetShakti — OpenAI advisory integration

Status: implemented as an optional server-side evidence-extraction adapter.

## Purpose

OpenAI is an **AI evidence assistant**, not the AssetShakti decision engine.

The intended flow is:

```
Authoritative source
      ↓
Source capture / observation
      ↓
OpenAI extraction (advisory)
      ↓
Evidence ledger
      ↓
Deterministic Shakti gates + scorer
      ↓
BID_READY / CONDITIONAL / DO_NOT_BID / INSUFFICIENT_EVIDENCE
```

The model may extract source-reported assertions, identify missing categories,
surface contradictions and explain why an assertion was classified as uncertain.
It must never manufacture title, possession, valuation, litigation clearance or
other facts.

## API

The adapter uses the OpenAI Responses API from the server side:

- endpoint: `POST /v1/responses`
- credential: `OPENAI_API_KEY`
- optional model override: `OPENAI_ASSET_SHAKTI_MODEL`

No API key is stored in the repository.

OpenAI's current API guidance recommends the Responses API for direct model
requests and says API keys must be kept secret and loaded from environment
variables or a server-side key-management service.

## Security

Never:

- put `OPENAI_API_KEY` in React/Vite client code;
- commit the key to Git;
- paste the key into ChatGPT;
- write the key into an evidence record;
- treat model output as authoritative verification.

For local PowerShell setup:

```powershell
setx OPENAI_API_KEY "<YOUR_KEY>"
```

Open a new PowerShell window after using `setx`.

For production, use the deployment platform's server-side secret store rather
than a committed `.env` file.

## Cost control

AssetShakti should remain multi-provider and deterministic-first.

OpenAI should be called only when it adds measurable value, for example:

- extracting structured facts from long auction notices;
- identifying evidence gaps;
- finding contradictions in a source;
- producing a human-readable evidence explanation.

Do not call an AI model to calculate or override the final Shakti decision.

## Validation rule

Every AI-generated evidence item remains `REPORTED_BY_SOURCE` or
`UNVERIFIED`. Only an independent authoritative validation workflow can
produce `VERIFIED`.

The 50-real-case production certification gate remains unchanged.
