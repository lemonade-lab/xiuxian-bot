import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import alias from '@rollup/plugin-alias'
import dts from 'rollup-plugin-dts'

/**
 * @param {*} input
 * @param {*} dir
 * @param {*} inc
 * @returns
 */
const buildJs = (input, dir, inc) => {
  return {
    input: input,
    output: {
      dir: dir,
      format: 'es',
      sourcemap: false,
      preserveModules: true
    },
    plugins: [
      typescript({
        compilerOptions: {
          outDir: dir
        },
        include: [inc]
      })
    ],
    onwarn: (warning, warn) => {
      if (warning.code === 'UNRESOLVED_IMPORT') return
      warn(warning)
    }
  }
}

/**
 *
 * @param {*} input
 * @param {*} dir
 * @param {*} inc
 * @returns
 */
const buildDts = (input, dir, inc) => {
  return {
    input: input,
    output: {
      // lib 目录
      dir: dir,
      format: 'es',
      sourcemap: false,
      preserveModules: true
    },
    plugins: [
      alias({
        entries: [
          {
            find: '@',
            replacement: resolve(dirname(fileURLToPath(import.meta.url)), 'src')
          }
        ]
      }),
      typescript({
        compilerOptions: {
          outDir: dir
        },
        include: [inc]
      }),
      dts()
    ],
    onwarn: (warning, warn) => {
      if (warning.code === 'UNRESOLVED_IMPORT') return
      warn(warning)
    }
  }
}

/**
 *
 */
const config = []

const BuildByName = name => {
  const input = `packages/${name}/src/index.ts`
  const dir = `packages/${name}/lib`
  const inc = `packages/${name}/src/**/*`
  config.push(buildJs(input, dir, inc))
  config.push(buildDts(input, dir, inc))
}

BuildByName('jsxp')

export default defineConfig(config.flat(Infinity))
