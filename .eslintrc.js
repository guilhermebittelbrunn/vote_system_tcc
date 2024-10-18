import preset from 'config/eslint-preset'

export default {
    ...preset,
    rules: {
        ...preset.rules,
        '@typescript-eslint/no-namespace': 'off',
        'max-classes-per-file': 'off',
        'dot-notation': 'off'
    },
};
