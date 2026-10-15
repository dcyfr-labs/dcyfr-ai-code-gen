# DCYFR AI Code Gen — Custom Security Scan Instructions

<!-- TLP:CLEAR -->
<!-- Referenced by .github/workflows/security-review.yml via custom-security-scan-instructions -->
<!-- Provides stack context and focus areas so analysis is precise rather than generic. -->

## Tech Stack Context

- **Package type**: Public TypeScript npm library (`@dcyfr/ai-code-gen`).
  Consumed by `dcyfr-labs` and external developers for AI-powered code
  generation workflows. Security issues here affect all consumers of the
  package.
- **Core purpose**: Provides utilities for generating, transforming, and
  validating code using LLMs. Takes code snippets, prompts, or templates as
  input and returns generated code.
- **LLM integrations**: Uses Vercel AI SDK / Anthropic SDK for LLM calls. API
  keys are passed as constructor arguments or read from environment variables.
  The library does not store credentials.
- **Code execution risk**: This library generates code strings but should NOT
  execute them dynamically. Any `eval()`, `new Function()`, `vm.runInContext()`,
  or `child_process.exec()` call where the input is LLM-generated code is an
  injection risk.
- **File system writes**: If the library writes generated code to disk, verify
  that output paths are validated and do not allow path traversal beyond the
  intended output directory.
- **Template processing**: Any Handlebars, Mustache, EJS, or similar template
  engine usage where the template itself is user-supplied (rather than
  developer-authored) can lead to SSTI (Server-Side Template Injection).

## High-Priority Areas to Focus On

1. **Dynamic code execution** (`src/generators/`, `src/executors/` or similar):
   Any `eval()`, `new Function(code)()`, `vm.Script`, or `child_process.exec()`
   call where the string being executed is LLM-generated output is a direct
   RCE risk. Verify generated code is never directly executed — only written
   to disk or returned to the caller.

2. **Template injection**: If template strings are built by concatenating
   user-supplied values into Handlebars/EJS/Mustache templates, verify that
   untrusted input is HTML/JS escaped before insertion.

3. **Path traversal in output file writes**: Any `fs.writeFile()`,
   `fs.writeFileSync()`, or `Bun.write()` where the output path includes
   user-supplied input must be validated to stay within the intended output
   directory.

4. **Prompt injection via LLM calls**: If developer-supplied code or comments
   are injected verbatim into LLM prompts without sanitisation, malicious code
   in the input could redirect the LLM to output harmful content. Consider
   whether the library needs a content policy layer on generated output.

5. **API key handling** (any code reading env vars):
   Verify LLM API keys are never passed in URL query strings, never logged, and
   never included in error stack traces. Check verbose logging paths.

6. **Prototype pollution in utility/merge functions**: Any exported function
   that does deep object merge or `Object.assign` on user-supplied objects
   without `Object.create(null)` protection is a prototype pollution risk.

## Severity Calibration Guidance

- **Critical**: Dynamic execution of LLM-generated code (`eval`, `new Function`,
  subprocess exec), hardcoded API key or token, RCE via SSTI, prototype
  pollution in exported core utilities.
- **High**: Path traversal to sensitive writing locations, API key leakage
  via logs or error messages, prompt injection that produces RCE payload.
- **Medium**: Information disclosure in error messages, TOCTOU on output file
  writes, unconstrained template rendering with user-supplied templates.
- **Low / Informational**: Verbose internal state logging without sensitive
  data, best-practice deviations without a direct exploitability path.

## Out of Scope

- `node_modules/` — dependency scanning handled by Dependabot and `npm audit`.
- `dist/` — generated build output.
- `examples/` — demo scripts, not production library code.
- `scripts/` — build and release tooling.
- `coverage/` — test coverage reports.
- Test files (`*.test.ts`, `*.spec.ts`) — note issues but do not block PRs on
  low-severity test-only findings.
