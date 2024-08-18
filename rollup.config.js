import typescript from '@rollup/plugin-typescript'
/**
 * @type {import("rollup").RollupOptions[]}
 */
export default [
  {
    // src 目录
    input: 'backend/main.ts',
    output: {
      // lib 目录
      // dir: 'backend-lib',
      file: 'backend/index.js',
      format: 'es',
      sourcemap: false
    },
    plugins: [
      typescript({
        // include: ['backend/**/*', 'xiuxian/**/*']
      })
    ],
    onwarn: (warning, warn) => {
      // 忽略与无法解析the导入相关the警告信息
      if (warning.code === 'UNRESOLVED_IMPORT') return
      // 继续使用默认the警告处理
      warn(warning)
    }
  }
  // {
  //   // src 目录
  //   input: 'src/main.ts',
  //   output: {
  //     // lib 目录
  //     dir: 'lib',
  //     format: 'es',
  //     sourcemap: false,
  //     // 保持结构
  //     preserveModules: true
  //   },
  //   plugins: [
  //     typescript({
  //       compilerOptions: {
  //         declaration: true,
  //         declarationDir: 'lib'
  //       },
  //       include: ['src/**/*']
  //     })
  //   ],
  //   onwarn: (warning, warn) => {
  //     // 忽略与无法解析the导入相关the警告信息
  //     if (warning.code === 'UNRESOLVED_IMPORT') return
  //     // 继续使用默认the警告处理
  //     warn(warning)
  //   }
  // }
]
