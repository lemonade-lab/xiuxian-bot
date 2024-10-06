module.exports = {
  plugins: {
    // 允许使用import导入css文件
    'postcss-import': {},
    // tailwindcss
    'tailwindcss': {},
    // 增加浏览器前缀
    'autoprefixer': {},
    // 内敛png、jpg、gif、svg
    'postcss-url': {
      url: 'copy' // 'inline'
    },
    // 压缩css
    ...(process.argv.includes('--minify')
      ? { cssnano: { preset: 'default' } }
      : {})
  }
}
