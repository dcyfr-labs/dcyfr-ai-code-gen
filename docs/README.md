<!-- TLP:CLEAR -->
# Documentation Index

Documentation for `@dcyfr/ai-code-gen`. For installation and a quick start, see the [root README](../README.md).

## Reference

- [API.md](API.md): API reference for the core generators, the template engine, AST utilities, and AI integration.

## Guides

- [CODE_GENERATORS.md](CODE_GENERATORS.md): the built-in generators, how to write custom generators, generator configuration, the generator registry, file system integration, and advanced patterns.
- [TEMPLATE_ENGINE.md](TEMPLATE_ENGINE.md): Handlebars templating with the built-in helpers, template registration, partials and composition, advanced patterns, and custom helpers.
- [AST_MANIPULATION.md](AST_MANIPULATION.md): parsing TypeScript, transformations, code analysis, structure comparison, and code formatting.
- [AI_INTEGRATION.md](AI_INTEGRATION.md): connecting AI providers for code generation, code review, refactoring suggestions, and documentation generation.

## Possibly outdated

- [TEST_COVERAGE_IMPROVEMENT_PLAN.md](TEST_COVERAGE_IMPROVEMENT_PLAN.md): a plan to raise test coverage from 78.38% line and 64.65% branch to 90% and 85%. It lists `tests/unit/file-system.test.ts` and the logger and template builtins tests as missing and counts 9 test files, but `tests/unit/` now holds 12 test files including those.
