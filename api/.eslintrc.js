const preset = require('config/eslint-preset');

module.exports = {
    ...preset,
    rules: {
        ...preset.rules,
        '@typescript-eslint/no-namespace': 'off',
        'max-classes-per-file': 'off',
        'dot-notation': 'off'
    },
};
