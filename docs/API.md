# API Reference

**@dcyfr/ai-code-gen** - AI-powered code generation toolkit for TypeScript/JavaScript projects

Version: 1.0.0 (Production Ready)  
Last Updated: February 7, 2026

---

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Core Generators](#core-generators)
  - [ComponentGenerator](#componentgenerator)
  - [ApiRouteGenerator](#apiroutegenerator)
  - [ModelGenerator](#modelgenerator)
  - [TestGenerator](#testgenerator)
- [Template Engine](#template-engine)
- [AST Utilities](#ast-utilities)
- [AI Integration](#ai-integration)
- [Configuration](#configuration)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)
- [Semantic Versioning Commitment](#semantic-versioning-commitment)

---

## Overview

`@dcyfr/ai-code-gen` provides a comprehensive toolkit for automated code generation, including:

- **Pre-built generators** for common patterns (components, API routes, models, tests)
- **Template engine** with Handlebars syntax and custom helpers
- **AST manipulation** using TypeScript Compiler API via ts-morph
- **AI integration** for intelligent code generation and refactoring
- **Extensible architecture** for custom generators

### Key Features

- ✅ TypeScript-first with full type safety
- ✅ Zero-config defaults with customization options
- ✅ Tree-shakeable ESM modules
- ✅ Comprehensive test coverage (90%+)
- ✅ Semantic versioning for API stability

---

## Installation

```bash
npm install @dcyfr/ai-code-gen

# Or with yarn
yarn add @dcyfr/ai-code-gen

# Or with pnpm
pnpm add @dcyfr/ai-code-gen
```

### Requirements

- Node.js >= 20.0.0
- TypeScript >= 5.0.0 (for type definitions)

---

## Core Generators

### ComponentGenerator

Generate React functional components with TypeScript props, tests, and Storybook stories.

#### API

```typescript
import { ComponentGenerator, createTemplateEngine } from '@dcyfr/ai-code-gen';

const engine = createTemplateEngine();
const generator = new ComponentGenerator(engine);

const result = await generator.generate({
  name: 'MyComponent',
  outputDir: './src/components',
  options: {
    props: [
      { name: 'title', type: 'string', required: true },
      { name: 'count', type: 'number', required: false },
    ],
    hasChildren: true,
    useClient: false,
    withTest: true,
    withStory: false,
    description: 'A custom component for displaying data',
  },
});

console.log(result.files);
// [
//   { path: 'src/components/MyComponent.tsx', content: '...' },
//   { path: 'src/components/MyComponent.test.tsx', content: '...' }
// ]
```

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `props` | `Array<PropDefinition>` | No | `[]` | Component props with types |
| `hasChildren` | `boolean` | No | `false` | Include children prop |
| `useClient` | `boolean` | No | `false` | Add 'use client' directive (Next.js App Router) |
| `withTest` | `boolean` | No | `true` | Generate test file |
| `withStory` | `boolean` | No | `false` | Generate Storybook story |
| `description` | `string` | No | - | JSDoc description |

#### PropDefinition

```typescript
interface PropDefinition {
  name: string;      // Prop name (camelCase)
  type: string;      // TypeScript type
  required?: boolean; // Default: true
  default?: any;     // Default value
  description?: string; // Prop documentation
}
```

#### Example Output

```tsx
// src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  /**
   * The title to display
   */
  title: string;
  
  /**
   * Optional count value
   */
  count?: number;
  
  /**
   * Child elements
   */
  children?: React.ReactNode;
}

/**
 * A custom component for displaying data
 */
export function MyComponent({ 
  title, 
  count, 
  children 
}: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      {count && <p>Count: {count}</p>}
      {children}
    </div>
  );
}
```

---

### ApiRouteGenerator

Generate REST API route handlers for Next.js, Express, or generic Node.js servers.

#### API

```typescript
import { ApiRouteGenerator, createTemplateEngine } from '@dcyfr/ai-code-gen';

const generator = new ApiRouteGenerator(createTemplateEngine());

const result = await generator.generate({
  name: 'users',
  outputDir: './src/app/api',
  options: {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    framework: 'nextjs',
    withValidation: true,
    withAuth: true,
    database: 'prisma',
    description: 'User management API endpoints',
  },
});
```

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `methods` | `HttpMethod[]` | Yes | `['GET']` | HTTP methods to generate |
| `framework` | `'nextjs' \| 'express' \| 'node'` | No | `'nextjs'` | Target framework |
| `withValidation` | `boolean` | No | `true` | Include Zod validation |
| `withAuth` | `boolean` | No | `false` | Include auth middleware |
| `database` | `'prisma' \| 'mongodb' \| 'none'` | No | `'none'` | Database integration |

#### Example Output

```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    
    const users = await db.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    
    const body = await request.json();
    const validated = UserSchema.parse(body);
    
    const user = await db.user.create({ data: validated });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

---

### ModelGenerator

Generate data models with validation, TypeScript types, and database schemas.

#### API

```typescript
import { ModelGenerator, createTemplateEngine } from '@dcyfr/ai-code-gen';

const generator = new ModelGenerator(createTemplateEngine());

const result = await generator.generate({
  name: 'User',
  outputDir: './src/models',
  options: {
    fields: [
      { name: 'id', type: 'string', required: true, primary: true },
      { name: 'email', type: 'string', required: true, unique: true },
      { name: 'name', type: 'string', required: true },
      { name: 'createdAt', type: 'Date', required: true },
    ],
    withValidation: true,
    withPrisma: true,
    withZod: true,
  },
});
```

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `fields` | `FieldDefinition[]` | Yes | - | Model fields |
| `withValidation` | `boolean` | No | `true` | Generate Zod schema |
| `withPrisma` | `boolean` | No | `false` | Generate Prisma schema |
| `withZod` | `boolean` | No | `true` | Generate Zod validators |
| `relations` | `Relation[]` | No | `[]` | Model relationships |

---

### TestGenerator

Generate comprehensive test files with Vitest, Jest, or other testing frameworks.

#### API

```typescript
import { TestGenerator, createTemplateEngine } from '@dcyfr/ai-code-gen';

const generator = new TestGenerator(createTemplateEngine());

const result = await generator.generate({
  name: 'UserService',
  outputDir: './tests/unit',
  options: {
    framework: 'vitest',
    targetFile: './src/services/user-service.ts',
    coverage: 'unit',
    withMocks: true,
  },
});
```

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `framework` | `'vitest' \| 'jest' \| 'mocha'` | No | `'vitest'` | Test framework |
| `targetFile` | `string` | Yes | - | File to test |
| `coverage` | `'unit' \| 'integration' \| 'e2e'` | No | `'unit'` | Test type |
| `withMocks` | `boolean` | No | `true` | Include mock setup |

---

## Template Engine

The template engine uses Handlebars with custom helpers for code generation.

### API

```typescript
import { TemplateEngine, createTemplateEngine } from '@dcyfr/ai-code-gen';

// Create engine instance
const engine = createTemplateEngine();

// Register custom template
engine.registerTemplate({
  name: 'my-template',
  content: `
export interface {{pascalCase name}}Props {
  {{#each props}}
  {{name}}: {{type}};
  {{/each}}
}
  `,
  variables: ['name', 'props'],
  category: 'custom',
});

// Render template
const result = engine.render('my-template', {
  name: 'my-component',
  props: [
    { name: 'title', type: 'string' },
    { name: 'count', type: 'number' },
  ],
});

console.log(result.content);
```

### Built-in Helpers

| Helper | Description | Example |
|--------|-------------|---------|
| `pascalCase` | Convert to PascalCase | `{{pascalCase "my-component"}}` → `MyComponent` |
| `camelCase` | Convert to camelCase | `{{camelCase "my-component"}}` → `myComponent` |
| `kebabCase` | Convert to kebab-case | `{{kebabCase "MyComponent"}}` → `my-component` |
| `snakeCase` | Convert to snake_case | `{{snakeCase "MyComponent"}}` → `my_component` |
| `capitalize` | Capitalize first letter | `{{capitalize "hello"}}` → `Hello` |
| `plural` | Pluralize word | `{{plural "user"}}` → `users` |
| `singular` | Singularize word | `{{singular "users"}}` → `user` |

### Built-in Templates

```typescript
import {
  REACT_COMPONENT_TEMPLATE,
  API_ROUTE_TEMPLATE,
  DATA_MODEL_TEMPLATE,
  TEST_FILE_TEMPLATE,
  BARREL_EXPORT_TEMPLATE,
} from '@dcyfr/ai-code-gen';
```

---

## AST Utilities

Powerful AST manipulation using TypeScript Compiler API.

### Parse Source Code

```typescript
import { parseSource, parseFile } from '@dcyfr/ai-code-gen';

// Parse from string
const ast = parseSource(`
  export function hello(name: string) {
    return \`Hello, \${name}\`;
  }
`);

// Parse from file
const fileAst = await parseFile('./src/index.ts');
```

### Transform Code

```typescript
import { transform } from '@dcyfr/ai-code-gen';

const result = await transform('./src/index.ts', {
  addImport: {
    module: 'react',
    imports: ['useState', 'useEffect'],
  },
  addExport: {
    name: 'MyComponent',
    isDefault: false,
  },
});

console.log(result.code); // Transformed code
```

### Analyze Code

```typescript
import { analyzeCode } from '@dcyfr/ai-code-gen';

const analysis = analyzeCode(sourceCode);

console.log(analysis.metrics);
// {
//   lines: 150,
//   complexity: 8,
//   functions: 12,
//   classes: 3,
//   coverage: 0.95
// }
```

### Utility Functions

| Function | Description | Returns |
|----------|-------------|---------|
| `parseSource(code)` | Parse TypeScript source | `ASTNode` |
| `parseFile(path)` | Parse file from disk | `Promise<ASTNode>` |
| `transform(source, ops)` | Apply transformations | `TransformResult` |
| `analyzeCode(source)` | Analyze code metrics | `AnalysisResult` |
| `formatTypeScript(code)` | Format with Prettier | `string` |
| `generateImport(spec)` | Generate import statement | `string` |
| `generateExport(spec)` | Generate export statement | `string` |

---

## AI Integration

Integrate with AI providers for intelligent code generation.

### API

```typescript
import { 
  AICodeGenerator, 
  createAICodeGenerator,
  MockAIProvider 
} from '@dcyfr/ai-code-gen';

// Create AI generator with mock provider (for testing)
const aiGen = createAICodeGenerator(new MockAIProvider());

// Generate code from prompt
const result = await aiGen.generateCode({
  prompt: 'Create a React hook for fetching user data',
  language: 'typescript',
  framework: 'react',
});

console.log(result.code);
```

### Custom AI Provider

```typescript
import type { AIProvider, AICodeRequest, AICodeResponse } from '@dcyfr/ai-code-gen';

class MyAIProvider implements AIProvider {
  async generateCode(request: AICodeRequest): Promise<AICodeResponse> {
    // Call your AI service (OpenAI, Anthropic, etc.)
    const response = await fetch('https://api.myai.com/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    return response.json();
  }
  
  async reviewCode(code: string, context?: any) {
    // Implement code review logic
  }
}

const customAI = new MyAIProvider();
const generator = createAICodeGenerator(customAI);
```

---

## Configuration

### Load Configuration File

```typescript
import { loadConfig, validateConfig } from '@dcyfr/ai-code-gen';

// Load from file (codegen.config.json or .codegenrc)
const config = await loadConfig('./codegen.config.json');

// Validate configuration
const errors = validateConfig(config);
if (errors.length > 0) {
  console.error('Invalid configuration:', errors);
}
```

### Configuration Schema

```typescript
interface CodeGenConfig {
  generators?: {
    component?: Partial<ComponentOptions>;
    api?: Partial<ApiRouteOptions>;
    model?: Partial<ModelOptions>;
    test?: Partial<TestOptions>;
  };
  templates?: {
    customDir?: string;
    builtins?: string[];
  };
  output?: {
    baseDir?: string;
    preserveStructure?: boolean;
    overwrite?: boolean;
  };
  ai?: {
    provider?: 'openai' | 'anthropic' | 'custom';
    apiKey?: string;
    model?: string;
  };
}
```

### Example Configuration

```json
{
  "generators": {
    "component": {
      "useClient": false,
      "withTest": true,
      "hasChildren": true
    }
  },
  "output": {
    "baseDir": "./src",
    "overwrite": false
  },
  "ai": {
    "provider": "openai",
    "model": "gpt-4"
  }
}
```

---

## Type Definitions

All public types are exported from the main entry point.

### Core Types

```typescript
import type {
  Generator,
  GeneratorConfig,
  GeneratedFile,
  GenerationResult,
  TemplateDefinition,
  ASTNode,
  CodeMetrics,
  AIProvider,
} from '@dcyfr/ai-code-gen';
```

### Generator Interface

```typescript
interface Generator {
  meta: GeneratorMeta;
  generate(config: GeneratorConfig): Promise<GenerationResult>;
  validate(config: GeneratorConfig): ValidationError[];
}

interface GeneratorConfig {
  name: string;
  outputDir: string;
  options?: Record<string, any>;
  overwrite?: boolean;
}

interface GenerationResult {
  success: boolean;
  files: GeneratedFile[];
  errors?: GenerationError[];
  warnings?: string[];
}

interface GeneratedFile {
  path: string;
  content: string;
  language?: string;
}
```

---

## Error Handling

All generators and utilities follow consistent error handling patterns.

### Error Types

```typescript
import type { 
  GenerationError,
  ValidationError,
  TransformError 
} from '@dcyfr/ai-code-gen';

try {
  const result = await generator.generate(config);
  
  if (!result.success) {
    result.errors?.forEach(error => {
      console.error(`Error in ${error.file}:`, error.message);
    });
  }
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.field, error.message);
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CONFIG` | Configuration validation failed |
| `TEMPLATE_NOT_FOUND` | Requested template doesn't exist |
| `PARSE_ERROR` | Failed to parse source code |
| `TRANSFORM_ERROR` | Code transformation failed |
| `FILE_EXISTS` | Output file already exists (overwrite=false) |
| `AI_ERROR` | AI provider request failed |

---

## Semantic Versioning Commitment

`@dcyfr/ai-code-gen` follows [Semantic Versioning 2.0.0](https://semver.org/).

### Version Format: `MAJOR.MINOR.PATCH`

- **MAJOR (x.0.0):** Breaking API changes, removed exports, incompatible changes
- **MINOR (1.x.0):** New features, new exports, backward-compatible additions
- **PATCH (1.0.x):** Bug fixes, performance improvements, no API changes

### Stability Guarantee

Starting with v1.0.0:
- **Public API is stable** - No breaking changes within major version
- **Deprecation Policy** - Minimum 1 minor version notice before removal
- **Migration Guides** - Provided for all major version upgrades
- **Long-term Support** - Security updates for latest minor version (12+ months)

### Breaking Changes

Breaking changes will ALWAYS bump the major version and include:
- Removed or renamed exports
- Changed function signatures
- Modified return types (non-backward compatible)
- Changed default behavior
- Increased minimum Node.js version

### Deprecation Process

1. **Deprecate** - Add `@deprecated` JSDoc tag with alternative
2. **Maintain** - Keep deprecated API for minimum 1 minor version
3. **Remove** - Remove in next major version
4. **Document** - List in CHANGELOG.md with migration guide

---

## CLI Usage

Use the included CLI for quick code generation:

```bash
# Install globally
npm install -g @dcyfr/ai-code-gen

# Generate component
dcyfr-codegen component MyButton --with-test --output src/components

# Generate API route
dcyfr-codegen api users --methods GET,POST --framework nextjs

# Generate model
dcyfr-codegen model User --with-prisma --output src/models

# Show help
dcyfr-codegen --help
```

---

## Examples

### Full Workflow Example

```typescript
import {
  createGeneratorRegistry,
  ComponentGenerator,
  TestGenerator,
  createTemplateEngine,
} from '@dcyfr/ai-code-gen';

async function generateFeature() {
  // Setup
  const engine = createTemplateEngine();
  const registry = createGeneratorRegistry();
  
  // Register generators
  registry.register(new ComponentGenerator(engine));
  registry.register(new TestGenerator(engine));
  
  // Generate component
  const componentResult = await registry.generate('component', {
    name: 'UserCard',
    outputDir: './src/components',
    options: {
      props: [
        { name: 'user', type: 'User', required: true },
      ],
      withTest: true,
    },
  });
  
  if (componentResult.success) {
    console.log('✅ Generated:', componentResult.files.map(f => f.path));
  }
}

generateFeature();
```

---

## Support

- **Documentation:** https://github.com/dcyfr-labs/dcyfr-ai-code-gen#readme
- **Issues:** https://github.com/dcyfr-labs/dcyfr-ai-code-gen/issues
- **Changelog:** https://github.com/dcyfr-labs/dcyfr-ai-code-gen/blob/main/CHANGELOG.md
- **Security:** See [SECURITY.md](../SECURITY.md)

---

**API Reference Version:** 1.0.0  
**Package Version:** ^1.0.0  
**Last Updated:** February 7, 2026  
**Maintained By:** DCYFR Team

---

## License

MIT License - See [LICENSE](../LICENSE) for details.
