# Security Policy

## Supported Versions

We actively support the following versions of `@dcyfr/ai-code-gen`:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 1.x.x   | :white_check_mark: | Active support, security updates |
| 0.2.x   | :warning:          | Legacy support until v1.0.0 stable (90 days) |
| < 0.2   | :x:                | No longer supported |

**Note:** After v1.0.0 release, we will maintain security updates for the latest minor version within the current major version for a minimum of 12 months.

---

## Reporting a Vulnerability

**IMPORTANT:** Please do NOT create public GitHub issues for security vulnerabilities.

We take security seriously and appreciate responsible disclosure. If you discover a security vulnerability in `@dcyfr/ai-code-gen`, please report it privately using one of the following methods:

### 📧 Email (Preferred)
**Email:** security@dcyfr.ai  
**Subject:** `[SECURITY] @dcyfr/ai-code-gen - [Brief Description]`

**Include in your report:**
- Description of the vulnerability
- Steps to reproduce
- Affected versions
- Potential impact
- Suggested fix (if any)

### 🔒 GitHub Security Advisories
Use GitHub's private vulnerability reporting:
https://github.com/dcyfr-labs/dcyfr-ai-code-gen/security/advisories/new

---

## Response Timeline

| Action | Timeline |
|--------|----------|
| **Initial Response** | Within 48 hours |
| **Vulnerability Triage** | Within 5 business days |
| **Fix Development** | Depends on severity (see below) |
| **Security Advisory** | Published with fix release |

### Severity Levels

- **Critical:** Fix within 7 days, immediate patch release
- **High:** Fix within 14 days, patch release
- **Medium:** Fix within 30 days, next minor/patch release
- **Low:** Fix in next scheduled release

---

## Security Best Practices

When using `@dcyfr/ai-code-gen` in your projects:

### ✅ DO
- **Keep dependencies updated:** Regularly run `npm update @dcyfr/ai-code-gen`
- **Validate generated code:** Always review AI-generated code before deployment
- **Use latest stable version:** Install from `^1.0.0` (semantic versioning)
- **Sanitize user inputs:** If using code generation with user-provided templates
- **Run security audits:** `npm audit` before production deployments
- **Use HTTPS for API calls:** If code generation uses external AI services
- **Limit file system access:** Run code generation in sandboxed environments when possible

### ❌ DON'T
- **Execute generated code blindly:** Always review before running
- **Expose API keys in templates:** Use environment variables for secrets
- **Trust unvalidated templates:** Validate template sources before use
- **Run as root/admin:** Use least-privilege principles
- **Store credentials in generated code:** Use secure credential management

---

## Known Security Considerations

### 1. Code Generation Risks
AI-generated code may not always follow security best practices. **Always review generated code** for:
- SQL injection vulnerabilities
- XSS (Cross-Site Scripting) risks
- Path traversal issues
- Insecure deserialization
- Hardcoded credentials

### 2. Template Injection
If using custom templates with user input:
- Validate and sanitize all template variables
- Use a sandbox for template rendering
- Implement Content Security Policy (CSP) for web outputs

### 3. File System Access
Code generation may write to the file system:
- Restrict output directories with proper permissions
- Validate file paths to prevent directory traversal
- Use allowlists for permitted output locations

### 4. Dependency Chain
`@dcyfr/ai-code-gen` depends on:
- `ts-morph` - TypeScript AST manipulation
- `handlebars` - Template engine
- `chalk` - Terminal styling (dev only)

We actively monitor these dependencies for vulnerabilities.

---

## Security Updates

Subscribe to security notifications:

- **GitHub Watch:** Click "Watch" → "Custom" → "Security alerts only"
- **npm Advisory:** https://www.npmjs.com/package/@dcyfr/ai-code-gen
- **RSS Feed:** https://github.com/dcyfr-labs/dcyfr-ai-code-gen/security/advisories.atom

---

## Vulnerability Disclosure Policy

### Timeline
1. **Report received** → We acknowledge within 48 hours
2. **Investigation** → Reproduce and assess impact (5 days)
3. **Fix development** → Based on severity (7-30 days)
4. **Coordinated disclosure** → We notify you before public release
5. **Public advisory** → Published with fix (CVE assigned if applicable)
6. **Credit** → With your permission, we credit reporters in CHANGELOG.md

### Recognition
We maintain a Security Hall of Fame for responsible disclosure (with permission):
- **SECURITY_HALL_OF_FAME.md** (coming soon)

---

## Compliance & Standards

`@dcyfr/ai-code-gen` follows:

- **OWASP Top 10** - Awareness and mitigation strategies
- **CWE/SANS Top 25** - Common weakness enumeration
- **NIST Cybersecurity Framework** - Risk management practices
- **Semantic Versioning** - Breaking changes require major version bump

---

## Security Audit History

| Date | Type | Auditor | Results |
|------|------|---------|---------|
| TBD | Internal | DCYFR Labs Security Team | Pending v1.0.0 release |

---

## Contact

**General Security:** security@dcyfr.ai  
**Private Reporting:** [GitHub Security Advisories](https://github.com/dcyfr-labs/dcyfr-ai-code-gen/security/advisories/new)  
**Emergency Contact:** For critical vulnerabilities affecting production systems, include "URGENT" in subject line

---

**Last Updated:** February 7, 2026  
**Policy Version:** 1.0.0  
**Effective Date:** Upon v1.0.0 release

---

## Additional Resources

- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [DCYFR Security Policy](https://github.com/dcyfr-labs/.github/blob/main/SECURITY.md)

Thank you for helping keep `@dcyfr/ai-code-gen` and the DCYFR ecosystem secure! 🔒
