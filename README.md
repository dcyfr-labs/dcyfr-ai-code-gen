# @dcyfr/ai-code-gen

<!-- README-META
  tlp_clearance: GREEN
  status: active
  name: dcyfr-ai-code-gen
  description: AI-powered code generation toolkit - template generators, AST manipulation, intelligent scaffolding, and AI-assisted refactoring
  last_validated: 2026-03-29
-->

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/dcyfr-labs/dcyfr-ai-code-gen)

> AI-powered code generation toolkit with AST manipulation, template engine, and intelligent scaffolding.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-24+-green.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)]()
[![Sponsor](https://img.shields.io/badge/sponsor-30363D?style=flat-square&logo=GitHub-Sponsors&logoColor=#EA4AAA)](https://github.com/sponsors/dcyfr)

## About DCYFR

`@dcyfr/ai-code-gen` is maintained by **DCYFR Labs** as part of the DCYFR AI tooling portfolio.

- **DCYFR** is a registered trademark of DCYFR Labs.
- Primary domain: [www.dcyfr.ai](https://www.dcyfr.ai)
- Trademark guidance: [../TRADEMARK.md](../TRADEMARK.md)
- Licensing details: [LICENSE](./LICENSE)

---

## ⚡ 30-Second Quick Start

```bash
# Install package
npm install @dcyfr/ai-code-gen

# Generate React component
import { createGeneratorRegistry } from '@dcyfr/ai-code-gen';
const registry = createGeneratorRegistry();
await registry.run('component', { name: 'user-card' });
# ✅ Component generated with tests
```

---

## 🧭 Related Packages

| Package                                | Purpose                | Type        |
| -------------------------------------- | ---------------------- | ----------- |
| [@dcyfr/ai](../dcyfr-ai)               | Core AI framework      | npm package |
| [@dcyfr/ai-cli](../dcyfr-ai-cli)       | CLI tool               | npm package |
| [@dcyfr/ai-agents](../dcyfr-ai-agents) | Autonomous agents      | Template    |
| [dcyfr-labs](../dcyfr-labs)            | Production Next.js app | Application |

---

## Overview

`@dcyfr/ai-code-gen` is a comprehensive code generation toolkit that combines template-based scaffolding, AST (Abstract Syntax Tree) manipulation, and AI-assisted code generation. It provides a complete pipeline for generating, analyzing, transforming, and reviewing TypeScript code.

**Perfect for:**

- 🚀 Accelerating development with intelligent code scaffolding
- 🧪 Ensuring consistency across large codebases with standardized patterns
- 🔍 Automated code quality analysis and refactoring suggestions
- 🤖 Integrating AI-powered code generation into your workflow
- 📝 Generating documentation, tests, and boilerplate automatically

## Features

✅ **Template Engine** — Handlebars-based with 20+ built-in helpers for case conversion, conditionals, and code generation patterns  
✅ **Code Generators** — Pre-built generators for React components, API routes, data models, test files, and barrel exports  
✅ **AST Module** — Parse, transform, analyze, and format TypeScript code using ts-morph  
✅ **AI Integration** — Pluggable AI provider system for intelligent code generation, review, and refactoring  
✅ **CLI** — Command-line interface for scaffolding, analysis, and code review  
✅ **Extensible** — Register custom templates, generators, and AI providers  
✅ **Type-Safe** — Full TypeScript support with strict mode enabled  
✅ **Well-Tested** — Comprehensive test suite with Vitest

## Installation

```bash
npm install @dcyfr/ai-code-gen
```

## Quick Start

### Generate a React Component

```typescript
import { createGeneratorRegistry } from "@dcyfr/ai-code-gen";

const registry = createGeneratorRegistry();

const result = await registry.run("component", {
  name: "user-card",
  outputDir: "src/components",
  options: {
    props: [
      { name: "name", type: "string", required: true },
      { name: "avatar", type: "string" },
    ],
    useClient: true,
    withTest: true,
  },
});

for (const file of result.files) {
  console.log(`Generated: ${file.path}`);
}
```

### Analyze TypeScript Code

```typescript
import { analyzeCode } from "@dcyfr/ai-code-gen";

const analysis = analyzeCode(`
  function processData(input: any) {
    console.log(input);
    if (input.a) {
      if (input.b) {
        if (input.c) {
          return true;
        }
      }
    }
    return false;
  }
`);

console.log(analysis.issues);
// Detects: console.log usage, `any` type, high complexity
```

### Transform Code with AST

```typescript
import { transform } from "@dcyfr/ai-code-gen";

const result = transform(sourceCode, [
  { type: "add-import", moduleSpecifier: "zod", namedImports: ["z"] },
  { type: "rename", oldName: "fetchData", newName: "loadData" },
  { type: "add-export", exportName: "UserSchema" },
]);

console.log(result.source);
```

### Use the Template Engine

```typescript
import { TemplateEngine } from "@dcyfr/ai-code-gen";

const engine = new TemplateEngine();

const result = engine.renderSource(
  "export function {{camelCase name}}({{#each params}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}): {{returnType}} {}",
  {
    name: "get-user-data",
    params: ["id: string", "options?: Options"],
    returnType: "Promise<User>",
  },
);

console.log(result.content);
// export function getUserData(id: string, options?: Options): Promise<User> {}
```

## Built-in Generators

| Generator   | Description                                | Output                                  |
| ----------- | ------------------------------------------ | --------------------------------------- |
| `component` | React functional component with TypeScript | `.tsx` + barrel export                  |
| `api-route` | Next.js API route handler                  | `.ts` with GET/POST/PUT/DELETE          |
| `model`     | Zod schema data model                      | `.ts` with schema + types + factory     |
| `test`      | Vitest test file                           | `.test.ts` with describe/it scaffolding |

## Built-in Template Helpers

### Case Conversion

- `{{pascalCase name}}` → `UserProfile`
- `{{camelCase name}}` → `userProfile`
- `{{kebabCase name}}` → `user-profile`
- `{{snakeCase name}}` → `user_profile`
- `{{constantCase name}}` → `USER_PROFILE`

### Conditionals

- `{{#if condition}}...{{/if}}`
- `{{#unless condition}}...{{/unless}}`
- `{{eq a b}}`, `{{neq a b}}`, `{{or a b}}`, `{{and a b}}`, `{{not a}}`

### Utilities

- `{{pluralize word}}` — Simple pluralization
- `{{join array ", "}}` — Join array elements
- `{{timestamp}}` — ISO timestamp
- `{{year}}` — Current year
- `{{typeAnnotation type}}` — TypeScript type annotation
- `{{genericType base param}}` — Generic type syntax

## AST Module

### Parse

```typescript
import { parseSource, parseFile } from "@dcyfr/ai-code-gen";

const ast = parseSource("class User { name: string; }");
// Returns: classes, interfaces, functions, types, enums, variables, imports, exports, metrics
```

### Transform

```typescript
import { transform } from "@dcyfr/ai-code-gen";

const result = transform(source, [
  { type: "add-import", moduleSpecifier: "zod", namedImports: ["z"] },
  { type: "remove-import", moduleSpecifier: "lodash" },
  {
    type: "add-property",
    className: "User",
    propertyName: "email",
    propertyType: "string",
  },
  {
    type: "add-method",
    className: "User",
    methodName: "validate",
    returnType: "boolean",
    body: "return true;",
  },
  { type: "rename", oldName: "oldFunc", newName: "newFunc" },
  { type: "add-export", exportName: "MyType" },
]);
```

### Analyze

```typescript
import { analyzeCode, compareStructure } from "@dcyfr/ai-code-gen";

const analysis = analyzeCode(source);
// Detects: dead-code, complexity, naming, missing-jsdoc, large-file issues

const diff = compareStructure(oldSource, newSource);
// Returns: added, removed, modified declarations
```

### Format

```typescript
import {
  formatTypeScript,
  addLicenseHeader,
  generateJsDoc,
} from "@dcyfr/ai-code-gen";

const formatted = formatTypeScript(source, { singleQuote: true, tabWidth: 2 });
const withHeader = addLicenseHeader(source, "MIT", 2026);
const doc = generateJsDoc({
  description: "Process data",
  params: [{ name: "input", type: "string" }],
});
```

## AI Integration

```typescript
import { createAICodeGenerator } from "@dcyfr/ai-code-gen";

// Uses MockAIProvider by default; plug in your own AIProvider for real AI
const ai = createAICodeGenerator({ provider: "mock", model: "gpt-4" });

// Generate code
const generated = await ai.generateCode({
  prompt: "Create a user service",
  language: "TypeScript",
});

// Review code
const review = await ai.reviewCode({
  code: sourceCode,
  language: "TypeScript",
});

// Suggest refactoring
const suggestions = await ai.suggestRefactoring({
  code: sourceCode,
  language: "TypeScript",
});

// Generate documentation
const docs = await ai.generateDocs({
  code: sourceCode,
  language: "TypeScript",
});
```

## CLI Usage

```bash
# Generate a React component
npx dcyfr-codegen generate component user-card --output src/components

# Analyze a TypeScript file
npx dcyfr-codegen analyze src/utils.ts

# Review code quality
npx dcyfr-codegen review src/service.ts

# List available generators
npx dcyfr-codegen list

# Show help
npx dcyfr-codegen help
```

## Custom Templates

```typescript
import { TemplateEngine } from "@dcyfr/ai-code-gen";

const engine = new TemplateEngine();

engine.registerTemplate({
  id: "my-template",
  name: "Custom Template",
  description: "My custom code template",
  outputExtension: ".ts",
  variables: [{ name: "name", type: "string", required: true }],
  source: "export class {{pascalCase name}} {\n  // TODO: implement\n}\n",
});

const result = engine.render("my-template", { name: "my-service" });
```

## Documentation

Comprehensive guides for mastering code generation:

- **[Template Engine Guide](docs/TEMPLATE_ENGINE.md)** (1,054 lines)  
  Learn Handlebars templating with 20+ custom helpers, partials, custom helpers, and advanced patterns for code generation.

- **[AST Manipulation Guide](docs/AST_MANIPULATION.md)** (1,017 lines)  
  Master TypeScript AST parsing, transformations, code analysis, custom transformers, and metadata extraction.

- **[Code Generators Guide](docs/CODE_GENERATORS.md)** (908 lines)  
  Build custom generators with Zod validation, hooks, multi-file generation, and advanced composition patterns.

- **[AI Integration Guide](docs/AI_INTEGRATION.md)** (915 lines)  
  Integrate AI providers (OpenAI, Anthropic), prompt engineering, code review workflows, and custom AI providers.

**Total: 3,894 lines of production-ready documentation**

## Examples

See [`examples/README.md`](examples/README.md) for a quick runbook and per-example type-check commands.

Three comprehensive executable examples showcasing advanced patterns:

### 1. Custom Generator ([examples/custom-generator.ts](examples/custom-generator.ts))

Build a complete feature generator with:

- Zod schema validation
- Generator hooks (beforeGenerate, afterGenerate, postProcess)
- Multi-file generation (service, repository, schema, tests, barrel exports)
- Post-processing (formatting, license headers)
- Full CRUD operations with Prisma/Drizzle support

### 2. AST Refactoring ([examples/ast-refactoring.ts](examples/ast-refactoring.ts))

Complex code transformation workflows:

- Migrate React class components → function components with hooks
- Add dependency injection decorators
- Modernize callbacks → promises → async/await
- Remove `any` types and add error handling
- Extract interfaces from classes
- Batch refactoring multiple files

### 3. Template Composition ([examples/template-composition.ts](examples/template-composition.ts))

Advanced Handlebars patterns:

- Reusable partials for file headers, imports, JSDoc
- Template inheritance with base layouts
- Dynamic component generation from data
- Conditional imports based on feature flags
- Custom helpers for complex logic
- Nested templates with context passing
- Dynamic form generation with Zod validation

Run examples:

```bash
npx tsx examples/custom-generator.ts
npx tsx examples/ast-refactoring.ts
npx tsx examples/template-composition.ts
```

## Best Practices

### Code Generation

✅ **Use Specific Prompts** — Provide detailed requirements instead of vague descriptions  
✅ **Validate Input** — Always validate data with Zod before generating code  
✅ **Format Output** — Run generated code through Prettier for consistency  
✅ **Add Documentation** — Include JSDoc comments for generated functions  
✅ **Test Generated Code** — Verify generated code compiles and passes tests

### Template Design

✅ **Use Partials** — Extract reusable fragments into partials  
✅ **Consistent Helpers** — Use built-in helpers for case conversion  
✅ **Validate Variables** — Define required variables in template schema  
✅ **Test Edge Cases** — Test templates with empty/null/missing data  
✅ **Version Templates** — Track template changes with versioning

### AST Transformations

✅ **Parse Once** — Parse source once, apply multiple transformations  
✅ **Type-Safe** — Use TypeScript types for transformation parameters  
✅ **Validate Before** — Check AST structure before transforming  
✅ **Format After** — Always format code after transformations  
✅ **Handle Errors** — Gracefully handle malformed code

### AI Integration

✅ **Set Low Temperature** — Use 0.0-0.3 for deterministic code generation  
✅ **Provide Context** — Include existing code for better AI suggestions  
✅ **Review AI Output** — Always review AI-generated code before use  
✅ **Handle Rate Limits** — Implement retry logic with exponential backoff  
✅ **Log AI Calls** — Track AI usage for debugging and cost monitoring

## Troubleshooting

### Common Issues

**Template rendering fails**

```
Error: Missing required variable 'name'
```

**Solution:** Ensure all required variables are provided in template data.

**AST transformation fails**

```
Error: Cannot find class 'UserService'
```

**Solution:** Verify class exists in source before applying transformation. Use `parseSource()` to inspect AST structure.

**Code analysis detects false positives**

```
Warning: any-type detected at line 15
```

**Solution:** Update analysis rules or add `// @ts-ignore` comments for intentional `any` usage.

**AI rate limit exceeded**

```
RateLimitError: Too many requests
```

**Solution:** Implement retry logic with exponential backoff. Consider using a rate limiter utility.

**Generated code doesn't compile**

```
TS2304: Cannot find name 'User'
```

**Solution:** Ensure required imports are added. Use `add-import` transformation before generating code.

### Getting Help

- **GitHub Issues:** [https://github.com/dcyfr/dcyfr-ai-code-gen/issues](https://github.com/dcyfr/dcyfr-ai-code-gen/issues)
- **Documentation:** See comprehensive guides in `docs/` directory
- **Examples:** Run example files in `examples/` directory
- **Community:** Join discussions on GitHub

## Architecture

```
src/
├── types/          # TypeScript type definitions
├── lib/            # Core utilities (config, logger, strings, file-system)
├── templates/      # Handlebars template engine + built-in templates
├── generators/     # Code generators (component, api-route, model, test)
├── ast/            # AST parsing, transformation, analysis, formatting
├── ai/             # AI provider integration + prompt engineering
├── cli.ts          # CLI entry point
└── index.ts        # Public API barrel export
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Run tests (`npm test`)
5. Run type check (`npx tsc --noEmit`)
6. Run linter (`npm run lint`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Code Quality Standards

- ✅ All code must be TypeScript with strict mode
- ✅ All functions must have JSDoc comments
- ✅ Test coverage must be ≥80%
- ✅ All tests must pass before merging
- ✅ Follow existing code style (enforced by ESLint)

## Roadmap

### v1.1 (Q2 2026)

- [ ] Additional AI providers (Google Gemini, Mistral, local LLMs)
- [ ] Visual Studio Code extension
- [ ] Interactive CLI with prompts
- [ ] Generator marketplace

### v1.2 (Q3 2026)

- [ ] Support for Python, Java, and Go code generation
- [ ] Advanced refactoring patterns (design pattern migration)
- [ ] Real-time code review in IDE
- [ ] Team collaboration features

### v2.0 (Q4 2026)

- [ ] Multi-file project scaffolding
- [ ] AI-powered architecture suggestions
- [ ] Code migration tool (React Class → Hooks, JavaScript → TypeScript)
- [ ] Enterprise features (SSO, audit logs, team management)

## Development

```bash
# Install dependencies
npm install

# Type check
npx tsc --noEmit

# Run tests
npm test

# Run tests in watch mode
npx vitest

# Lint
npm run lint
```

## Requirements

- Node.js >= 24
- TypeScript >= 5.3

## License

MIT — see [LICENSE](LICENSE) for details.
