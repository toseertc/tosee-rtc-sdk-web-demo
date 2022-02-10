module.exports = (api) => {
  api.cache.using(() => process.env.BABEL_ENV_TARGETS_BROWSERS)

  return {
    presets: [
      ['@babel/preset-env', {
        targets: {
          chrome: '58',
        },
        loose: true,
      }],
      '@babel/preset-react',
    ],
    plugins: [
      'lodash',
      ['import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      }]
    ],
  }
}
