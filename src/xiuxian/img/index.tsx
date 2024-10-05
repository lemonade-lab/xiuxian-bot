import React from 'react'
import { render, LinkCSS } from 'react-puppeteer'
import * as Component from './src/component/index.js'
import css_output from '@public/output.css'
import css_root from '@public/css/root.css'
import css_root_path from '@public/css/root-path.css'
import { join } from 'path'
export const PictureOptions = {
  // 别名
  file_paths: {
    '@public': join(process.cwd(), 'public')
  },
  // 别名资源
  html_files: [css_root_path],
  // 头部插入其他资源（ 数组或字符串）
  html_head: (
    <>
      <LinkCSS src={css_output} />
      <LinkCSS src={css_root} />
    </>
  )
}
/**
 *
 * @param key
 * @param options
 * @returns
 */
export const pictureRender = <TKey extends keyof typeof Component>(
  key: TKey,
  options?: {
    props?: Parameters<(typeof Component)[TKey]>[0]
    name: string
  }
) => {
  // 选择组件
  const MyComponent = Component[key]
  // 使用参数
  const Props = (options.props ?? {}) as any
  // 截图
  return render({
    // 地址
    join_dir: key,
    // 地址
    html_name: `${options?.name ?? 'help'}.html`,
    // ...
    ...PictureOptions,
    // body 内容
    html_body: <MyComponent {...Props} />
  })
}
export * from './src/core/index.js'
export { Component }
