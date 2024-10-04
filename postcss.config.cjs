module.exports = {
  plugins: {
    // 允许使用import导入css文件
    'postcss-import': {},
    // tailwindcss
    'tailwindcss': {},
    // 增加浏览器前缀
    'autoprefixer': {},
    // 压缩css
    'cssnano': {
      preset: 'default'
    }
  }
}
