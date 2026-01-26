import tseslint from 'typescript-eslint';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginFunctional from 'eslint-plugin-functional';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
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
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // --- TypeScript ---
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/restrict-template-expressions': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
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
    files: ['**/types.ts', '**/*.types.ts'],
    rules: {
      'import/no-named-export': 'off',
    },
  },

  // --- Test files ---
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/test/**/*.ts', '**/*.test.js'],
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
