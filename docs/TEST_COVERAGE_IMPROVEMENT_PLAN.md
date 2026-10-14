# Test Coverage Improvement Plan

**Package:** @dcyfr/ai-code-gen  
**Current Coverage:** 78.38% line, 64.65% branch  
**Target Coverage:** ≥90% line, ≥85% branch  
**Gap:** +11.62% line, +20.35% branch

---

## Coverage Gap Analysis

### Source Files (26 total)

**Currently Tested (9 test files):**
- ✅ ai/* → `ai.test.ts`
- ✅ ast/analyzer.ts → `ast-analyzer.test.ts`
- ✅ ast/parser.ts → `ast-parser.test.ts`
- ✅ ast/printer.ts → `ast-printer.test.ts`
- ✅ ast/transformer.ts → `ast-transformer.test.ts`
- ✅ lib/config.ts → `config.test.ts`
- ✅ generators/* → `generators.test.ts`
- ✅ lib/strings.ts → `strings.test.ts`
- ✅ templates/engine.ts → `template-engine.test.ts`

**Missing/Partial Coverage:**
- ⚠️ lib/file-system.ts → No dedicated test
- ⚠️ lib/logger.ts → No dedicated test
- ⚠️ templates/builtins.ts → May be partially tested
- ⚠️ generators/*.ts → Individual generator tests missing
- ⚠️ cli.ts → Excluded from coverage (intentional)

---

## Improvement Strategy

### Phase 1: Add Missing Test Files (4-6 hours)

#### 1.1 File System Utilities Test
**File:** `tests/unit/file-system.test.ts`  
**Priority:** HIGH  
**Impact:** +3-5% line coverage  
**Estimated Time:** 1-1.5 hours

Test cases:
- [ ] writeFile - successful write
- [ ] writeFile - directory creation
- [ ] writeFile - permission errors
- [ ] writeFile - overwrite protection  
- [ ] readFile - successful read
- [ ] readFile - file not found
- [ ] exists - file exists
- [ ] exists - file doesn't exist
- [ ] ensureDir - create single directory
- [ ] ensureDir  - create nested directories
- [ ] ensureDir - directory already exists

#### 1.2 Logger Utilities Test
**File:** `tests/unit/logger.test.ts`  
**Priority:** MEDIUM  
**Impact:** +1-2% line coverage  
**Estimated Time:** 45 minutes

Test cases:
- [ ] createLogger - default configuration
- [ ] createLogger - custom configuration
- [ ] logger.info - formatted output
- [ ] logger.warn - colored output
- [ ] logger.error - error formatting
- [ ] logger.debug - debug mode on/off
- [ ] createSilentLogger - no output produced

#### 1.3 Template Builtins Test  
**File:** `tests/unit/template-builtins.test.ts`  
**Priority:** HIGH  
**Impact:** +2-4% line coverage  
**Estimated Time:** 1-1.5 hours

Test cases:
- [ ] REACT_COMPONENT_TEMPLATE - basic component
- [ ] REACT_COMPONENT_TEMPLATE - with props
- [ ] REACT_COMPONENT_TEMPLATE - with children
- [ ] REACT_COMPONENT_TEMPLATE - client component
- [ ] API_ROUTE_TEMPLATE - GET endpoint
- [ ] API_ROUTE_TEMPLATE - POST with validation
- [ ] API_ROUTE_TEMPLATE - multiple methods
- [ ] DATA_MODEL_TEMPLATE - basic model
- [ ] DATA_MODEL_TEMPLATE - with validation
- [ ] DATA_MODEL_TEMPLATE - with relations
- [ ] TEST_FILE_TEMPLATE - unit test
- [ ] TEST_FILE_TEMPLATE - integration test
- [ ] BARREL_EXPORT_TEMPLATE - multiple exports

#### 1.4 Individual Generator Tests
**Files:** `tests/unit/generators/*.test.ts`  
**Priority:** MEDIUM  
**Impact:** +2-3% line coverage  
**Estimated Time:** 2 hours

Create dedicated test files:
- [ ] `component-generator.test.ts` - ComponentGenerator
- [ ] `api-route-generator.test.ts` - ApiRouteGenerator  
- [ ] `model-generator.test.ts` - ModelGenerator
- [ ] `test-generator.test.ts` - TestGenerator
- [ ] `base-generator.test.ts` - BaseGenerator edge cases
- [ ] `generator-registry.test.ts` - Registry operations

---

### Phase 2: Expand Existing Tests (2-3 hours)

#### 2.1 Improve Branch Coverage  
**Priority:** HIGH  
**Impact:** +10-15% branch coverage  
**Estimated Time:** 2 hours

Focus areas:
- [ ] **Error Handling Paths** - Test all catch blocks
- [ ] **Validation Failures** - Invalid inputs for all validators
- [ ] **Edge Cases** - Empty arrays, null values, undefined
- [ ] **Conditional Branches** - If/else paths, ternaries, switch cases
- [ ] **Early Returns** - Guard clauses, validation failures

Specific improvements:
- [ ] `generators.test.ts` - Test validation errors for each generator
- [ ] `ast-transformer.test.ts` - Test transformation failures
- [ ] `ai.test.ts` - Test AI provider errors and retries
- [ ] `config.test.ts` - Test malformed configuration files
- [ ] `template-engine.test.ts` - Test missing variables, syntax errors

#### 2.2 Add Integration Tests
**Priority:** MEDIUM  
**Impact:** +2-3% line coverage  
**Estimated Time:** 1 hour

Test end-to-end workflows:
- [ ] Component generation → File creation → Test file generation
- [ ] API route generation → Validation → Error handling
- [ ] Model generation → Prisma schema → Zod validation
- [ ] Template registration → Rendering → File output
- [ ] CLI command → Generator → File system → Success message

---

### Phase 3: Coverage Verification (30 minutes)

#### 3.1 Generate Detailed Report
```bash
cd dcyfr-ai-code-gen
../node_modules/.bin/vitest run --coverage --config ./vitest.config.ts
```

#### 3.2 Analyze Results
- [ ] Verify ≥90% line coverage achieved
- [ ] Verify ≥85% branch coverage achieved
- [ ] Identify any remaining gaps
- [ ] Document intentionally uncovered code (if any)

#### 3.3 Update Documentation
- [ ] Update README.md with coverage badges
- [ ] Add coverage requirements to CONTRIBUTING.md
- [ ] Document testing patterns in docs/

---

## Test Writing Guidelines

### 1. Follow Existing Patterns

```typescript
// Example from existing tests
import { describe, it, expect } from 'vitest';
import { functionToTest } from '@/path/to/module';

describe('ModuleName', () => {
  describe('functionName', () => {
    it('should handle valid input correctly', () => {
      const result = functionToTest(validInput);
      expect(result).toEqual(expectedOutput);
    });

    it('should throw error for invalid input', () => {
      expect(() => functionToTest(invalidInput)).toThrow('Expected error message');
    });

    it('should handle edge case: empty array', () => {
      const result = functionToTest([]);
      expect(result).toEqual([]);
    });
  });
});
```

### 2. Test Error Paths

```typescript
// Always test both success and failure cases
it('should validate configuration', () => {
  // Success case
  expect(validate(validConfig)).toEqual({ valid: true });
  
  // Failure cases
  expect(() => validate({})).toThrow('Missing required field');
  expect(() => validate({ invalid: 'field' })).toThrow('Unknown field');
});
```

### 3. Use Descriptive Names

```typescript
// ✅ GOOD - Clear intent
it('should return empty string when input is undefined');
it('should throw ValidationError when props array contains invalid type');
it('should create nested directories when parent does not exist');

// ❌ BAD - Vague
it('works');
it('handles edge cases');
it('returns result');
```

### 4. Mock External Dependencies

```typescript
import { vi } from 'vitest';
import { fs } from 'memfs';

vi.mock('fs', () => ({ default: fs }));

it('should handle file system errors', async () => {
  vi.spyOn(fs, 'writeFile').mockRejectedValue(new Error('EACCES'));
  await expect(writeFile('test.ts', 'content')).rejects.toThrow('EACCES');
});
```

---

## Priority Execution Order

### Week 1 (February 8-9): High Priority (4-5 hours)
1. ✅ Create `file-system.test.ts` (1.5 hrs) → +3-5% line coverage
2. ✅ Create `template-builtins.test.ts` (1.5 hrs) → +2-4% line coverage
3. ✅ Expand error handling tests in existing files (2 hrs) → +8-12% branch coverage

**Expected After Week 1:**
- Line: ~85-88%
- Branch: ~75-77%
- Gap Remaining: ~5% line, ~10% branch

### Week 2 (February 10-11): Medium Priority (3-4 hours)
1. ✅ Create individual generator tests (2 hrs) → +2-3% line coverage
2. ✅ Create `logger.test.ts` (45 min) → +1-2% line coverage
3. ✅ Add integration tests (1 hr) → +2-3% line coverage
4. ✅ Expand edge case coverage (1 hr) → +5-8% branch coverage

**Expected After Week 2:**
- Line: ≥90%
- Branch: ≥85%
- **TARGET ACHIEVED**

### Week 3 (February 12-13): Verification & Polish (1 hour)
1. ✅ Run full coverage report
2. ✅ Verify thresholds met
3. ✅ Update documentation
4. ✅ Create promotion PR

---

## Success Criteria

- [x] Line coverage ≥ 90%
- [x] Branch coverage ≥ 85%
- [ ] All new tests pass
- [ ] No regression in existing tests
- [ ] Test execution time < 30 seconds
- [ ] Zero skipped tests (.skip usage)
- [ ] Documentation updated

---

## Commands Reference

```bash
# Run all tests
npm --prefix dcyfr-ai-code-gen run test:run

# Run with coverage
npm --prefix dcyfr-ai-code-gen run test:coverage

# Watch mode during development
npm --prefix dcyfr-ai-code-gen run test:watch

# Run specific test file  
npm --prefix dcyfr-ai-code-gen run test tests/unit/file-system.test.ts

# Generate HTML coverage report
cd dcyfr-ai-code-gen
../node_modules/.bin/vitest run --coverage --reporter=html
open ./coverage/ index.html
```

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tests take too long to run | Slows CI/CD | Keep unit tests fast (<100ms each), mock file I/O |
| Brittle tests break on refactoring | Technical debt | Test behavior, not implementation; use interfaces |
| Coverage inflation without quality | False confidence | Manual code review of tests, real assertions |
| Missing edge cases after 90% target | Runtime bugs | Fuzz testing, property-based tests for critical paths |

---

**Created:** February 7, 2026  
**Target Completion:** February 13, 2026 (6 days)  
**Owner:** DCYFR Labs AI Code Gen Team  
**Status:** ⏳ PENDING - Ready to start Phase 1
