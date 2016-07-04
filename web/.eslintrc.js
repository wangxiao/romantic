module.exports = {
  extends: 'airbnb',
  plugins: [
    'html',
  ],
  env: {
    browser: true,
    jquery: true,
  },
  rules: {
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'consistent-return': 0,
    'no-else-return': 0,
    'max-len': 0,
    'no-console': [ 2, { allow: [ 'log' ] } ],
    'no-restricted-syntax': [ 0, 'ForInStatement' ],
    'no-new': 0,
  },
};
