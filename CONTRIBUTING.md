# Contributing to Embody

Thank you for your interest in contributing to the `@study-lenses/embody` project!

## Quick Start

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes following our conventions (see DEV.md)
5. Run tests: `npm test`
6. Run full validation: `npm run validate`
7. Submit a pull request

## Development Guidelines

- Follow all conventions in [DEV.md § Codebase Conventions](./DEV.md#codebase-conventions)
- Maintain pure functional approach
- Add tests in a `tests/` subdirectory alongside source (see [DEV.md § Test Organization](./DEV.md#test-organization))
- Maintain `README.md` (and `DOCS.md` for submodules) in every source directory (see [DEV.md § Per-Directory Documentation](./DEV.md#per-directory-documentation))
- Update documentation as needed

## Code Conventions at a Glance

| Situation                  | Convention                                   |
| -------------------------- | -------------------------------------------- |
| Non-trivial function       | Named `function` declaration                 |
| Inline callback (trivial)  | Arrow OK: `user => user.id`, `n => n > 0`    |
| Arrow assigned to variable | **Not allowed** — use `function` declaration |
| Callback (non-trivial)     | Extract as named `function`, pass by name    |
| `this` keyword             | **Banned** (functional codebase)             |
| Mutable closures           | **Banned** (pass state explicitly)           |
| Export                     | Define first, `export default` at bottom     |
| Import paths               | Always include `.js` extension               |
| Destructured object params | Default empty object: `{ ... } = {}`         |
| Boolean functions          | Prefix with `is`/`has`/`can`/`should`        |

Full conventions with rationale and examples: see [DEV.md § Codebase Conventions](./DEV.md#codebase-conventions).

## Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Minimal code example reproducing the issue
- Expected vs actual behavior
- Your environment (Node version, OS)

## Pull Request Process

1. Run `npm run validate` (lint, typecheck, and tests must all pass)
2. Update relevant documentation
3. Ensure `README.md`/`DOCS.md` are current in modified directories
4. Follow existing code patterns
5. Keep commits focused and descriptive
6. Reference any related issues

## Code of Conduct

See [CODE-OF-CONDUCT.md](./CODE-OF-CONDUCT.md) for our community guidelines.

## Questions?

Open an issue for clarification or discussion about potential changes.

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
