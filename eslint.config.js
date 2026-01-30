import tseslint from 'typescript-eslint';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginFunctional from 'eslint-plugin-functional';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginSonarJS from 'eslint-plugin-sonarjs';
import eslintPluginSecurity from 'eslint-plugin-security';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // --- Global ignores ---
  {
    ignores: ['dist/', 'node_modules/', '**/*.d.ts'],
  },

  // --- Base TypeScript configs ---
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // --- Prettier (must come after other configs to override formatting rules) ---
  eslintConfigPrettier,

  // --- All source files ---
  {
    files: ['src/**/*.ts'],
    plugins: {
      import: eslintPluginImport,
      functional: eslintPluginFunctional,
      unicorn: eslintPluginUnicorn,
      sonarjs: eslintPluginSonarJS,
      security: eslintPluginSecurity,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json',
      },
    },
    rules: {
      // --- TypeScript ---
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // `any` types: Warn during development, review in PR
      // Acceptable uses (see DEV.md § When `any` is OK):
      //   - Dynamic runtime values (JSON.parse, eval results)
      //   - Untyped library boundaries (wrapping Aran)
      //   - Generic utilities (deepClone, deepMerge)
      //   - Test fixtures (intentionally breaking types)
      //   - Stub implementations (temporary mock data)
      // All `any` usage must be justified in code review.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/restrict-template-expressions': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-shadow': 'error',

      // --- Import rules ---
      'import/extensions': ['error', 'always'],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],
      'import/no-named-export': 'error',
      'import/prefer-default-export': 'off',

      // --- Functional programming (eslint-plugin-functional) ---
      // ERRORS: Core conventions
      'functional/no-this-expressions': 'error',
      'functional/no-classes': 'error',
      // WARNINGS: Encourage immutability without blocking
      'functional/immutable-data': [
        'warn',
        {
          ignoreAccessorPattern: ['module.exports'],
        },
      ],
      'functional/prefer-readonly-type': 'warn',
      // OFF: Too strict for pedagogical codebase
      'functional/no-let': 'off',
      'functional/no-loop-statements': 'off',
      'functional/no-mixed-types': 'off',

      // --- Naming and style ---
      'func-names': ['error', 'always'],
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],

      // --- General rules ---
      'no-console': 'off',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'no-param-reassign': 'error',
      'no-shadow': 'off',
      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true,
        },
      ],
      'no-invalid-this': 'error',
      'arrow-body-style': ['error', 'never'],

      // --- Unicorn (recommended + additions) ---
      ...eslintPluginUnicorn.configs.recommended.rules,
      'unicorn/consistent-destructuring': 'error',
      'unicorn/prefer-switch': 'off', // Conflicts with switch ban
      'unicorn/switch-case-braces': 'off', // Conflicts with switch ban
      'unicorn/prefer-ternary': 'off',
      'unicorn/no-null': 'off',

      // --- SonarJS (recommended + additions + overrides) ---
      ...eslintPluginSonarJS.configs.recommended.rules,
      // Override levels
      'sonarjs/no-duplicate-string': 'error',
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/prefer-object-literal': 'error',
      // Disable conflicts/irrelevant
      'sonarjs/prefer-immediate-return': 'off',
      'sonarjs/max-switch-cases': 'off',
      'sonarjs/no-small-switch': 'off',
      'sonarjs/prefer-single-boolean-return': 'off',
      'sonarjs/enforce-trailing-comma': 'off',
      // Add rules not in recommended
      'sonarjs/bool-param-default': 'error',
      'sonarjs/destructuring-assignment-syntax': 'error',
      'sonarjs/values-not-convertible-to-numbers': 'error',
      'sonarjs/useless-string-operation': 'error',
      'sonarjs/strings-comparison': 'error',
      'sonarjs/non-number-in-arithmetic-expression': 'error',
      'sonarjs/no-unused-function-argument': 'error',
      'sonarjs/no-nested-incdec': 'error',
      'sonarjs/no-incorrect-string-concat': 'error',
      'sonarjs/no-inconsistent-returns': 'error',
      'sonarjs/no-function-declaration-in-block': 'error',
      'sonarjs/no-for-in-iterable': 'error',
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-built-in-override': 'error',
      'sonarjs/nested-control-flow': 'error',
      'sonarjs/expression-complexity': 'error',
      'sonarjs/no-inverted-boolean-check': 'error',

      // --- Naming conventions ---
      camelcase: [
        'error',
        {
          properties: 'never',
          ignoreDestructuring: true,
          ignoreImports: true,
        },
      ],

      // --- Ban switch statements ---
      'no-restricted-syntax': [
        'error',
        {
          selector: 'SwitchStatement',
          message: 'Switch statements are not allowed. Use if-else or lookup objects.',
        },
      ],

      // --- Security (warn only - educational codebase) ---
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-require': 'warn',
      'security/detect-eval-with-expression': 'warn',

      // --- LLM Guardrails (limit code bloat) ---
      'spaced-comment': ['error', 'always', { exceptions: ['-', '=', '*', '/'] }],
      'max-len': [
        'error',
        {
          code: 100,
          comments: Infinity, // Disable comment checking - use editor word wrap
          ignoreUrls: true,
          ignoreStrings: true,
        },
      ],
    },
  },

  // --- Plain JS files (disable type-checked rules, no TS project) ---
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },

  // --- Public API (named exports allowed) ---
  {
    files: ['src/index.ts'],
    rules: {
      'import/no-named-export': 'off',
    },
  },

  // --- Type definition files (named exports allowed) ---
  {
    files: ['**/types.ts', '**/*.types.ts', '**/types/*.ts'],
    rules: {
      'import/no-named-export': 'off',
    },
  },

  // --- Test files ---
  {
    files: ['**/*.test.ts', '**/*.test.js', '**/tests/**/*.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      'import/no-named-export': 'off',
      'functional/immutable-data': 'off',
      'functional/prefer-readonly-type': 'off',
      'arrow-body-style': 'off', // Test callbacks use standard arrow pattern
    },
  },

  // --- Example files ---
  {
    files: ['examples/**/*.js'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
