/**
 * Custom Generator Example - Building a Complete Feature Generator
 * 
 * This example demonstrates:
 * - Creating a custom generator with validation
 * - Using Zod for options schema
 * - Implementing generator hooks (beforeGenerate, afterGenerate, postProcess)
 * - Multi-file generation with templates
 * - Post-processing (formatting, transforming, adding imports)
 * - Registering and using the generator
 */

import { z } from 'zod';
import {
  BaseGenerator,
  createGeneratorRegistry,
  createTemplateEngine,
  formatTypeScript,
  type GeneratorMeta,
  type GeneratorConfig,
  type GeneratedFile,
  type ValidationError,
} from '@dcyfr/ai-code-gen';

// ============================================================================
// 1. Define Options Schema with Zod
// ============================================================================

const featureOptionsSchema = z.object({
  name: z.string().min(1, 'Feature name is required'),
  type: z.enum(['crud', 'service', 'repository']).default('crud'),
  useValidation: z.boolean().default(true),
  useAuth: z.boolean().default(false),
  database: z.enum(['prisma', 'drizzle', 'none']).default('none'),
  includeTests: z.boolean().default(true),
  outputDir: z.string().default('./src/features'),
});

type FeatureOptions = z.infer<typeof featureOptionsSchema>;

// ============================================================================
// 2. Create Custom Feature Generator
// ============================================================================

class FeatureGenerator extends BaseGenerator {
  readonly meta: GeneratorMeta = {
    name: 'feature',
    description: 'Generate a complete feature with service, repository, and tests',
    category: 'custom',
    version: '1.0.0',
  };

  protected async generateFiles(config: GeneratorConfig): Promise<GeneratedFile[]> {
    const { name, outputDir } = config;
    const opts = config.options ?? {};
    const type = (opts.type as string) ?? 'crud';
    const useValidation = (opts.useValidation as boolean) ?? true;
    const useAuth = (opts.useAuth as boolean) ?? false;
    const database = (opts.database as string) ?? 'none';
    const includeTests = (opts.includeTests as boolean) ?? true;

    console.log(`Generating feature: ${name}`);
    console.log(`Type: ${type}`);

    const files: GeneratedFile[] = [];

    // Generate interface file
    files.push({
      path: `${outputDir}/${name.toLowerCase()}/${name.toLowerCase()}.interface.ts`,
      content: generateInterface(name, type),
    });

    // Generate service file
    if (type === 'crud' || type === 'service') {
      files.push({
        path: `${outputDir}/${name.toLowerCase()}/${name.toLowerCase()}.service.ts`,
        content: generateService(name, { useValidation, useAuth, database }),
      });
    }

    // Generate repository file
    if (type === 'crud' || type === 'repository') {
      files.push({
        path: `${outputDir}/${name.toLowerCase()}/${name.toLowerCase()}.repository.ts`,
        content: generateRepository(name, database),
      });
    }

    // Generate validation schema
    if (useValidation) {
      files.push({
        path: `${outputDir}/${name.toLowerCase()}/${name.toLowerCase()}.schema.ts`,
        content: generateSchema(name),
      });
    }

    // Generate tests
    if (includeTests) {
      files.push({
        path: `${outputDir}/${name.toLowerCase()}/${name.toLowerCase()}.test.ts`,
        content: generateTests(name, type),
      });
    }

    // Generate barrel export
    files.push({
      path: `${outputDir}/${name.toLowerCase()}/index.ts`,
      content: generateBarrelExport(name, { useValidation, type }),
    });

    // Post-process: format TypeScript and add license header
    return files.map(file => {
      let content = file.content;
      if (file.path.endsWith('.ts')) {
        content = formatTypeScript(content);
      }
      content = addLicenseHeader(content);
      return { ...file, content };
    });
  }

  protected validateConfig(config: GeneratorConfig): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(config.name)) {
      errors.push({
        field: 'name',
        message: 'Feature name must be PascalCase (e.g., UserProfile)',
      });
    }
    return errors;
  }
}

const templateEngine = createTemplateEngine();
const featureGenerator = new FeatureGenerator(templateEngine);

// ============================================================================
// 3. Template Generation Functions
// ============================================================================

function generateInterface(name: string, type: string): string {
  const interfaceName = `I${name}`;
  
  if (type === 'crud' || type === 'repository') {
    return `
export interface ${interfaceName} {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Create${name}Dto {
  // Add properties here
}

export interface Update${name}Dto {
  // Add properties here
}

export interface I${name}Repository {
  findAll(): Promise<${interfaceName}[]>;
  findById(id: string): Promise<${interfaceName} | null>;
  create(data: Create${name}Dto): Promise<${interfaceName}>;
  update(id: string, data: Update${name}Dto): Promise<${interfaceName}>;
  delete(id: string): Promise<void>;
}
    `.trim();
  }
  
  return `
export interface ${interfaceName} {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
  `.trim();
}

function generateService(name: string, options: { useValidation: boolean; useAuth: boolean; database: string }): string {
  const { useValidation, useAuth } = options;
  
  const imports: string[] = [
    `import { I${name}, I${name}Repository, Create${name}Dto, Update${name}Dto } from './${name.toLowerCase()}.interface';`,
  ];
  
  if (useValidation) {
    imports.push(`import { ${name.toLowerCase()}Schema } from './${name.toLowerCase()}.schema';`);
  }
  
  const authCheck = useAuth
    ? `
  private checkPermissions(userId: string): void {
    // Implement permission check
    if (!userId) {
      throw new Error('Unauthorized');
    }
  }
  `
    : '';
  
  return `
${imports.join('\n')}

export class ${name}Service {
  constructor(private repository: I${name}Repository) {}

  async getAll${name}s(): Promise<I${name}[]> {
    return this.repository.findAll();
  }

  async get${name}ById(id: string): Promise<I${name}> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new Error(\`${name} not found: \${id}\`);
    }
    return entity;
  }

  async create${name}(data: Create${name}Dto): Promise<I${name}> {
    ${useValidation ? `const validated = ${name.toLowerCase()}Schema.parse(data);` : ''}
    return this.repository.create(${useValidation ? 'validated' : 'data'});
  }

  async update${name}(id: string, data: Update${name}Dto): Promise<I${name}> {
    await this.get${name}ById(id); // Ensure exists
    ${useValidation ? `const validated = ${name.toLowerCase()}Schema.partial().parse(data);` : ''}
    return this.repository.update(id, ${useValidation ? 'validated' : 'data'});
  }

  async delete${name}(id: string): Promise<void> {
    await this.get${name}ById(id); // Ensure exists
    await this.repository.delete(id);
  }
  ${authCheck}
}
  `.trim();
}

function generateRepository(name: string, database: string): string {
  const imports: string[] = [
    `import { I${name}, I${name}Repository, Create${name}Dto, Update${name}Dto } from './${name.toLowerCase()}.interface';`,
  ];
  
  let dbImport = '';
  let implementationCode = '';
  
  if (database === 'prisma') {
    dbImport = `import { PrismaClient } from '@prisma/client';`;
    implementationCode = `
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<I${name}[]> {
    return this.prisma.${name.toLowerCase()}.findMany();
  }

  async findById(id: string): Promise<I${name} | null> {
    return this.prisma.${name.toLowerCase()}.findUnique({ where: { id } });
  }

  async create(data: Create${name}Dto): Promise<I${name}> {
    return this.prisma.${name.toLowerCase()}.create({ data });
  }

  async update(id: string, data: Update${name}Dto): Promise<I${name}> {
    return this.prisma.${name.toLowerCase()}.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.${name.toLowerCase()}.delete({ where: { id } });
  }
    `;
  } else if (database === 'drizzle') {
    dbImport = `import { db } from '@/lib/db';`;
    implementationCode = `
  async findAll(): Promise<I${name}[]> {
    return db.select().from(${name.toLowerCase()}Table);
  }

  async findById(id: string): Promise<I${name} | null> {
    const results = await db.select().from(${name.toLowerCase()}Table).where(eq(${name.toLowerCase()}Table.id, id));
    return results[0] || null;
  }

  async create(data: Create${name}Dto): Promise<I${name}> {
    const [created] = await db.insert(${name.toLowerCase()}Table).values(data).returning();
    return created;
  }

  async update(id: string, data: Update${name}Dto): Promise<I${name}> {
    const [updated] = await db.update(${name.toLowerCase()}Table).set(data).where(eq(${name.toLowerCase()}Table.id, id)).returning();
    return updated;
  }

  async delete(id: string): Promise<void> {
    await db.delete(${name.toLowerCase()}Table).where(eq(${name.toLowerCase()}Table.id, id));
  }
    `;
  } else {
    implementationCode = `
  private data: Map<string, I${name}> = new Map();

  async findAll(): Promise<I${name}[]> {
    return Array.from(this.data.values());
  }

  async findById(id: string): Promise<I${name} | null> {
    return this.data.get(id) || null;
  }

  async create(data: Create${name}Dto): Promise<I${name}> {
    const entity: I${name} = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as I${name};
    this.data.set(entity.id, entity);
    return entity;
  }

  async update(id: string, data: Update${name}Dto): Promise<I${name}> {
    const existing = this.data.get(id);
    if (!existing) throw new Error('Not found');
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.data.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.data.delete(id);
  }
    `;
  }
  
  return `
${dbImport}
${imports.join('\n')}

export class ${name}Repository implements I${name}Repository {
  ${implementationCode}
}
  `.trim();
}

function generateSchema(name: string): string {
  return `
import { z } from 'zod';

export const ${name.toLowerCase()}Schema = z.object({
  // Add validation rules here
  id: z.string().uuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ${name}Schema = z.infer<typeof ${name.toLowerCase()}Schema>;
  `.trim();
}

function generateTests(name: string, type: string): string {
  return `
import { describe, it, expect, beforeEach } from 'vitest';
import { ${name}Service } from './${name.toLowerCase()}.service';
import { ${name}Repository } from './${name.toLowerCase()}.repository';

describe('${name}Service', () => {
  let service: ${name}Service;
  let repository: ${name}Repository;

  beforeEach(() => {
    repository = new ${name}Repository();
    service = new ${name}Service(repository);
  });

  describe('getAll${name}s', () => {
    it('should return all ${name.toLowerCase()}s', async () => {
      const result = await service.getAll${name}s();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('get${name}ById', () => {
    it('should return ${name.toLowerCase()} by id', async () => {
      const created = await service.create${name}({});
      const result = await service.get${name}ById(created.id);
      expect(result.id).toBe(created.id);
    });

    it('should throw error if not found', async () => {
      await expect(service.get${name}ById('invalid-id')).rejects.toThrow();
    });
  });

  describe('create${name}', () => {
    it('should create new ${name.toLowerCase()}', async () => {
      const result = await service.create${name}({});
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('update${name}', () => {
    it('should update existing ${name.toLowerCase()}', async () => {
      const created = await service.create${name}({});
      const updated = await service.update${name}(created.id, {});
      expect(updated.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
    });
  });

  describe('delete${name}', () => {
    it('should delete ${name.toLowerCase()}', async () => {
      const created = await service.create${name}({});
      await service.delete${name}(created.id);
      await expect(service.get${name}ById(created.id)).rejects.toThrow();
    });
  });
});
  `.trim();
}

function generateBarrelExport(name: string, options: { useValidation: boolean; type: string }): string {
  const exports: string[] = [
    `export * from './${name.toLowerCase()}.interface';`,
  ];
  
  if (options.type === 'crud' || options.type === 'service') {
    exports.push(`export * from './${name.toLowerCase()}.service';`);
  }
  
  if (options.type === 'crud' || options.type === 'repository') {
    exports.push(`export * from './${name.toLowerCase()}.repository';`);
  }
  
  if (options.useValidation) {
    exports.push(`export * from './${name.toLowerCase()}.schema';`);
  }
  
  return exports.join('\n');
}

function addLicenseHeader(content: string): string {
  const year = new Date().getFullYear();
  const header = `/**
 * Copyright (c) ${year} DCYFR Labs. All rights reserved.
 * This code is licensed under the MIT License.
 */

`;
  return header + content;
}

// ============================================================================
// 4. Register and Use the Custom Generator
// ============================================================================

async function main() {
  // Create registry and register custom generator
  const registry = createGeneratorRegistry();
  registry.register(featureGenerator);
  
  console.log('Registered generators:', registry.list());
  
  // Generate a User feature with CRUD operations
  console.log('\n--- Generating User Feature ---\n');
  
  const result = await registry.run('feature', {
    name: 'User',
    outputDir: './src/features',
    options: {
      type: 'crud',
      useValidation: true,
      useAuth: true,
      database: 'prisma',
      includeTests: true,
    },
  });
  
  console.log(`\nGenerated ${result.files.length} files:\n`);
  result.files.forEach(file => {
    console.log(`📄 ${file.path}`);
    console.log(`   ${file.content.split('\n').length} lines\n`);
  });
  
  // Preview generated service file
  const serviceFile = result.files.find(f => f.path.includes('.service.ts'));
  if (serviceFile) {
    console.log('--- User Service (Preview) ---\n');
    console.log(serviceFile.content.split('\n').slice(0, 30).join('\n'));
    console.log('\n... (truncated) ...\n');
  }
}

// Run example
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { featureGenerator, featureOptionsSchema };
