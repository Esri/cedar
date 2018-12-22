module.exports = {
  out: '../../docs/api',
  readme: 'none',
  exclude: [
    '**/query/*.ts',
    // TODO: exclude dataset once the types have been moved
    '**/dataset.ts'
  ],
  mode: 'file',
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: true,
  theme: './typedoc/theme'
};
