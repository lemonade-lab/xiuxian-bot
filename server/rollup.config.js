import typescript from '@rollup/plugin-typescript'
export default {
  input: 'server/main.ts',
  output: {
    file: 'server/index.js',
    format: 'module',
    sourcemap: false
  },
  plugins: [typescript()],
  onwarn: (warning, warn) => {
    if (warning.code === 'UNRESOLVED_IMPORT') return
    warn(warning)
  }
}
