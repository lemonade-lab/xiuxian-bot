module.exports = {
  plugins: {
    // 允许使用import导入css文件
    'postcss-import': {},
    // tailwindcss
    'tailwindcss': {},
    // 增加浏览器前缀
    'autoprefixer': {},
    // 内联url资源
    'postcss-url': {
      url: 'inline' // 'copy'
    },
    // 压缩css
    ...(process.argv.includes('--minify')
      ? { cssnano: { preset: 'default' } }
      : {})
  }
}
