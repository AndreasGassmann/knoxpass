module.exports = {
  node: { fs: 'empty' },
  entry: {
    background: 'apps/knoxpass-extension/src/extension/background.ts',
    content_script: 'apps/knoxpass-extension/src/extension/content_script.ts',
  },
};
