# Contributing to @dcyfr/ai-code-gen

Thank you for your interest in contributing to `@dcyfr/ai-code-gen`!

## Code of Conduct

This project follows the DCYFR Labs [Code of Conduct](https://github.com/dcyfr-labs/.github/blob/main/CODE_OF_CONDUCT.md).

## Licensing & Contributions

By contributing to `@dcyfr/ai-code-gen`, you agree that:

- Your contributions will be licensed under the project's MIT License
- You have the right to submit the contribution under this license
- You grant DCYFR Labs perpetual rights to use, modify, and distribute your contribution

### Trademark

DCYFR is a trademark of Drew Gowan. Do not use it in ways that imply endorsement without permission.

**Questions?** Contact [licensing@dcyfr.ai](mailto:licensing@dcyfr.ai)

## Development Setup

```bash
git clone <repository-url>
cd dcyfr-ai-code-gen
npm install
```

## Commands

```bash
npm test              # Run all tests
npx tsc --noEmit      # Type check
npm run lint          # Lint code
```

## Guidelines

1. **TypeScript Strict Mode** — All code must compile under strict mode with `noUnusedLocals` and `noUnusedParameters`.
2. **ESM Only** — Use `.js` extensions in import paths (TypeScript resolves `.ts` files from `.js` specifiers).
3. **Barrel Exports** — Every module directory must have an `index.ts` barrel export.
4. **Tests Required** — All new features need corresponding unit tests in `tests/unit/`.
5. **Named Exports** — No default exports; use named exports throughout.

## Template Authoring

When writing Handlebars templates:

- **Never** place a literal `}` immediately after a Handlebars close tag (`{{/if}}`, `{{/each}}`, `{{/unless}}`). Always add a newline between them to avoid triple `}}}` parse errors.

```handlebars
{{!-- ❌ WRONG --}}
{{/if}}}

{{!-- ✅ CORRECT --}}
{{/if}}
}
```

## Adding a Generator

1. Create a new file in `src/generators/`.
2. Extend `BaseGenerator` and implement `validateConfig()` and `generateFiles()`.
3. Register in `createGeneratorRegistry()` in `src/generators/registry.ts`.
4. Add tests in `tests/unit/`.
5. Update barrel exports.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
