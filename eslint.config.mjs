// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['eslint.config.mjs','dist/**','src/client/**'],
    },
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            semi: ['error', 'always'],                   // Require semicolons
            'comma-dangle': ['error', 'always-multiline'], // Enforce trailing commas in multiline
            'object-curly-spacing': ['warn', 'always'], // Require spacing inside braces
            
            '@typescript-eslint/explicit-function-return-type': ['warn'],
            '@typescript-eslint/explicit-module-boundary-types': ['warn'],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
);