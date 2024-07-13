import typescript from '@rollup/plugin-typescript'
import multiEntry from '@rollup/plugin-multi-entry'
const plugins = [typescript(), multiEntry()]
const onwarn = (warning, warn) => {
  if (warning.code === 'UNRESOLVED_IMPORT') return
  warn(warning)
}
const config = [
  {
    input: 'index.ts',
    file: 'dist/index.js'
  },
  {
    input: 'server/main.ts',
    file: 'server/index.js'
  }
]
export default config.map(item => ({
  input: item.input,
  output: {
    file: item.file,
    format: 'esm',
    sourcemap: false
  },
  plugins: plugins,
  onwarn: onwarn
}))
