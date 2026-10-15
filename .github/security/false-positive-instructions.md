# DCYFR AI Code Gen — False-Positive Filtering Instructions

<!-- TLP:CLEAR -->
<!-- Referenced by .github/workflows/security-review.yml via false-positive-filtering-instructions -->
<!-- Plain English instructions telling Claude which findings to suppress or downgrade. -->

## Suppress These Categories Entirely

- **`eval` in test helpers that evaluate known-safe expressions**: Unit tests
  that use `eval` on literal/constant strings (not user-supplied) to validate
  generated code syntax are not a live vulnerability. Report as informational
  only if the eval input is a compile-time constant, never if it includes
  dynamic / user-supplied content.

- **Template literal usage in code generation output strings**: The library
  constructs code-as-strings using template literals. Template literals that
  build source code text (not executed dynamically) are the library's core
  purpose; do not flag these as injection unless the output is also executed.

- **`process.env` access for API key environment variables**: Reading
  `process.env.ANTHROPIC_API_KEY` or `process.env.DCYFR_API_KEY` is the
  correct runtime pattern. Only report when a constant key value is hardcoded.

- **Generic "missing input validation" on internal utility functions**: Utility
  functions that are documented as accepting trusted developer input (not
  end-user input) are lower risk. Flag only if a function's exported surface
  would accept data from untrusted sources based on its documentation or usage.

- **Console logging of generated code snippets in debug mode**: Logging short
  code samples at debug verbosity for developer diagnostics is expected.
  Do not flag unless the log includes API keys, tokens, or PII.

## Lower Severity (Report as Low / Informational Only)

- Code transformation utility functions that accept developer-authored AST
  nodes as arguments where all callers in the exported API pass trusted input.

- Missing `try/catch` around LLM API calls — this is an error-handling gap,
  not a security vulnerability.

- Broad catch blocks in code generation pipelines — note but do not block PRs.

## Always Report (Do Not Suppress Even If Matching Above)

- Any hardcoded API key, token, or credentials string (even in comments or
  test fixtures).
- Any code path where LLM-generated output is passed to `eval()`, `new
  Function()`, `vm.runInContext()`, or `child_process.exec/spawn` without
  explicit sandboxing.
- Path traversal in file write operations to locations outside the intended
  output directory.
- Prototype pollution via recursive object merge utilities in the exported API.
- API keys or tokens passed as URL query parameters rather than headers.
- Any SSTI (Server-Side Template Injection) where the template itself is
  user-supplied rather than developer-authored.
