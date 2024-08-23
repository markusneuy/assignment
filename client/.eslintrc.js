/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'vuetify',
    '@vue/eslint-config-typescript',
    './.eslintrc-auto-import.json',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/script-indent': ['error', 2, {
      baseIndent: 0,
      switchCase: 2,
      ignores: [],
    }],
    semi: ['error', 'always'],
    'arrow-parens': ['error', 'always'],
  },
};
