# CLAUDE.md - AI Assistant Guide for Thuro Project

> **Last Updated**: 2025-11-30
> **Repository**: ryguy508/Thuro
> **Purpose**: Comprehensive guide for AI assistants working on this codebase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Development Workflow](#development-workflow)
4. [Code Conventions](#code-conventions)
5. [Git Workflow](#git-workflow)
6. [Testing Strategy](#testing-strategy)
7. [AI Assistant Guidelines](#ai-assistant-guidelines)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)

---

## Project Overview

### About Thuro

*This section should be updated with project-specific information as the codebase develops.*

**Project Type**: [To be determined - web app, CLI tool, library, etc.]
**Primary Language**: [To be determined]
**Framework**: [To be determined]
**Target Platform**: [To be determined]

### Key Objectives

- [Define primary goals]
- [Define secondary goals]
- [Define success metrics]

### Architecture Overview

*To be populated as architecture decisions are made.*

---

## Repository Structure

### Current Structure

```
Thuro/
├── .git/                 # Git repository metadata
└── CLAUDE.md            # This file
```

### Recommended Structure

As the project develops, consider organizing code using this structure:

```
Thuro/
├── src/                 # Source code
│   ├── core/           # Core business logic
│   ├── utils/          # Utility functions
│   ├── services/       # External service integrations
│   └── types/          # Type definitions
├── tests/              # Test files
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── e2e/           # End-to-end tests
├── docs/              # Documentation
├── scripts/           # Build and deployment scripts
├── config/            # Configuration files
├── .github/           # GitHub workflows and templates
├── package.json       # Dependencies (if Node.js)
├── README.md          # User-facing documentation
├── CONTRIBUTING.md    # Contribution guidelines
└── CLAUDE.md         # This file
```

---

## Development Workflow

### Setting Up Development Environment

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd Thuro
   ```

2. **Install dependencies**
   ```bash
   # Add installation commands as project develops
   ```

3. **Configure environment**
   ```bash
   # Add environment setup as needed
   ```

4. **Verify setup**
   ```bash
   # Add verification commands
   ```

### Branch Strategy

- **Main Branch**: `main` (or `master`) - Production-ready code
- **Development Branches**: `claude/[feature-name]-[session-id]` - AI assistant work
- **Feature Branches**: `feature/[feature-name]` - Human-led development
- **Bugfix Branches**: `bugfix/[issue-name]` - Bug fixes
- **Hotfix Branches**: `hotfix/[issue-name]` - Critical production fixes

### Development Cycle

1. Create feature branch from main
2. Implement changes with regular commits
3. Run tests and linting
4. Create pull request with detailed description
5. Code review and adjustments
6. Merge to main after approval

---

## Code Conventions

### General Principles

1. **Clarity over Cleverness**: Write code that is easy to understand
2. **Consistency**: Follow established patterns in the codebase
3. **Simplicity**: Avoid over-engineering; solve the current problem
4. **Documentation**: Comment complex logic, not obvious code
5. **Error Handling**: Handle errors gracefully with clear messages

### Naming Conventions

- **Variables**: `camelCase` or `snake_case` (establish convention)
- **Constants**: `UPPER_CASE_SNAKE_CASE`
- **Functions/Methods**: `camelCase` or `snake_case` with verb prefix
- **Classes**: `PascalCase`
- **Files**: `kebab-case.extension` or `PascalCase.extension`
- **Directories**: `kebab-case` or `camelCase`

### Code Style

*To be defined based on chosen language and framework:*

- Indentation: [spaces/tabs]
- Line length: [max characters]
- Quotes: [single/double]
- Semicolons: [required/optional]
- Trailing commas: [yes/no]

### Documentation Standards

#### Code Comments

```javascript
// Good: Explain WHY, not WHAT
// Calculate exponential backoff to prevent API rate limiting
const delay = Math.pow(2, retryCount) * 1000;

// Bad: Obvious comment
// Multiply by 1000
const delay = Math.pow(2, retryCount) * 1000;
```

#### Function Documentation

```javascript
/**
 * Retries a network operation with exponential backoff
 *
 * @param {Function} operation - Async operation to retry
 * @param {number} maxRetries - Maximum retry attempts (default: 3)
 * @param {number} baseDelay - Base delay in ms (default: 1000)
 * @returns {Promise} Result of the operation
 * @throws {Error} If all retries are exhausted
 */
async function retryWithBackoff(operation, maxRetries = 3, baseDelay = 1000) {
  // Implementation
}
```

---

## Git Workflow

### Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Examples**:
```
feat(auth): add OAuth2 authentication flow

Implement OAuth2 with Google and GitHub providers.
Includes token refresh logic and session management.

Closes #123
```

```
fix(api): handle network timeout errors

Add retry logic with exponential backoff for API calls
to prevent failures during network instability.
```

### Commit Best Practices

1. **Atomic Commits**: Each commit should represent a single logical change
2. **Descriptive Messages**: Explain WHAT and WHY, not HOW
3. **Present Tense**: Use "add feature" not "added feature"
4. **Reference Issues**: Link to relevant issues/tickets
5. **Small Commits**: Prefer smaller, focused commits over large ones

### Pull Request Guidelines

1. **Clear Title**: Summarize the change in one line
2. **Detailed Description**:
   - What changed and why
   - How to test the changes
   - Any breaking changes
   - Screenshots/recordings if UI changes
3. **Link Issues**: Reference related issues
4. **Request Reviews**: Tag appropriate reviewers
5. **CI/CD Checks**: Ensure all checks pass before review

---

## Testing Strategy

### Test Structure

```
tests/
├── unit/           # Fast, isolated tests
├── integration/    # Tests with external dependencies
└── e2e/           # Full system tests
```

### Testing Guidelines

1. **Test Coverage**: Aim for 80%+ coverage on critical paths
2. **Test Naming**: Descriptive names that explain what is tested
3. **AAA Pattern**: Arrange, Act, Assert
4. **Isolation**: Tests should not depend on each other
5. **Fast Tests**: Keep unit tests fast (<100ms)

### Running Tests

```bash
# Add test commands as project develops
# npm test
# npm run test:unit
# npm run test:integration
# npm run test:e2e
```

---

## AI Assistant Guidelines

### Core Principles

1. **Read Before Modifying**: Always read existing files before making changes
2. **Follow Existing Patterns**: Match the codebase's established conventions
3. **Avoid Over-Engineering**: Implement only what's requested
4. **Security First**: Check for vulnerabilities (XSS, SQL injection, etc.)
5. **Test Changes**: Verify changes work as expected

### Working with This Codebase

#### Before Starting Work

1. Read relevant source files
2. Check for existing similar implementations
3. Review recent commits for context
4. Understand the current architecture

#### During Development

1. Use TodoWrite tool to track tasks
2. Make atomic commits with clear messages
3. Run tests after changes
4. Check for security vulnerabilities
5. Follow established code style

#### Before Completing Work

1. Verify all tests pass
2. Check for console errors/warnings
3. Review changes for security issues
4. Ensure code follows conventions
5. Commit and push to correct branch

### Common Patterns to Follow

*To be populated as patterns emerge in the codebase.*

### Anti-Patterns to Avoid

1. **Don't** add features not explicitly requested
2. **Don't** refactor code outside the scope of changes
3. **Don't** add unnecessary abstractions
4. **Don't** use placeholder values in commits
5. **Don't** skip error handling at system boundaries
6. **Don't** add comments for self-evident code
7. **Don't** create backward-compatibility hacks unnecessarily

---

## Common Tasks

### Adding a New Feature

1. Create feature branch: `git checkout -b feature/feature-name`
2. Implement feature following code conventions
3. Add tests for new functionality
4. Update documentation if needed
5. Commit with descriptive message
6. Push and create pull request

### Fixing a Bug

1. Create bugfix branch: `git checkout -b bugfix/issue-description`
2. Write failing test that reproduces bug
3. Fix the bug
4. Verify test now passes
5. Commit with reference to issue
6. Push and create pull request

### Refactoring Code

1. Ensure tests exist for code being refactored
2. Make small, incremental changes
3. Run tests after each change
4. Keep commits focused on single refactoring
5. Document any architectural changes

### Adding Documentation

1. Place user docs in `docs/` directory
2. Update README.md for user-facing changes
3. Update CLAUDE.md for AI assistant guidance
4. Use clear, concise language
5. Include code examples where helpful

---

## Troubleshooting

### Common Issues

*This section will be populated as common issues are encountered.*

#### Issue Template

**Problem**: [Description]
**Cause**: [Root cause]
**Solution**: [How to fix]
**Prevention**: [How to avoid in future]

### Debug Checklist

- [ ] Check error messages and stack traces
- [ ] Verify dependencies are installed
- [ ] Check environment variables
- [ ] Review recent changes
- [ ] Check network connectivity
- [ ] Verify file permissions
- [ ] Clear cache/temporary files
- [ ] Check logs

### Getting Help

1. Check this documentation
2. Search existing issues
3. Review pull requests for similar work
4. Check external documentation
5. Create detailed issue with reproduction steps

---

## Additional Resources

### External Documentation

*Links to be added as project dependencies are established:*

- Framework documentation
- Language reference
- API documentation
- Third-party services

### Related Projects

*Links to similar or related projects for reference.*

### Learning Resources

*Helpful resources for understanding the tech stack.*

---

## Maintenance

### Keeping This File Updated

This file should be updated whenever:

- Project structure changes significantly
- New conventions are established
- Common issues are discovered
- New tools or dependencies are added
- Development workflow changes

**Last Review**: 2025-11-30
**Next Review**: [Set based on project activity]

---

## Changelog

### 2025-11-30
- Initial creation of CLAUDE.md
- Established basic structure and guidelines
- Created foundation for future updates

---

*This document is a living guide and should evolve with the project. Contributions to improve this documentation are welcome.*
