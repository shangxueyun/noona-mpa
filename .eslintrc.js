module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/strongly-recommended',
    '@vue/standard'
  ],
  globals: {
    'NativeFunction': true,
    'webkit': true,
    'WebViewJavascriptBridge': true,
    'nativePublicParams': true,
    '_czc': true,
    'Image': true,
    'saFormat': true,
    'deepLink': true,
    'cookie': true,
    'NoCaptcha': true,
    'TencentGDT': true
  },
  rules: {
    // === or ==
    'eqeqeq': 'off',
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': ['error', {
      'singleline': 5,
      'multiline': {
        'max': 1,
        'allowFirstLine': false
      }
    }],
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'never',
        'normal': 'any',
        'component': 'any'
      },
      'svg': 'always',
      'math': 'always'
    }],
    'vue/require-default-prop': false
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
