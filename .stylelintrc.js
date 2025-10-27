module.exports = {
  extends: ['stylelint-config-recommended'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    'selector-max-type': [
      0,
      {
        ignore: ['compounded', 'descendant', 'child'],
      },
    ],
  },
};
