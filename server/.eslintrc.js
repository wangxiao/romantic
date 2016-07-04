module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    node: true,
    mocha: true,
  },
  rules: {
    'strict': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'consistent-return': 0,
    'no-else-return': 0,
    'max-len': 0,
    'no-console': [ 2, { allow: ['warn', 'error'] } ],
    'no-restricted-syntax': [ 0, 'ForInStatement' ],
    'new-cap': 0,
    'no-shadow': 0,
    'guard-for-in': 0,
  }
};
