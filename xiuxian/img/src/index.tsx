import React from 'react'
import { dirname } from 'path'
import { createRequire } from 'react-puppeteer'
import * as Component from './component/index.js'
import { Picture } from 'react-puppeteer'
const require = createRequire(import.meta.url)

const CacheOptions = {
  // 别名
  file_paths: {
    // 定位自身的 md文件，并获取目录地址
    '@xiuxian': dirname(require('../../../README.md'))
  },
  // 别名资源
  html_files: [require('../../../public/css/root.css')],
  // 头部插入其他资源（ 数组或字符串）
  html_head: (
    <link rel="stylesheet" href={require('../../../public/output.css')} />
  )
}

class ScreenshotPicture extends Picture {
  constructor() {
    super()
    this.Pup.start()
  }

  /**
   *
   * @param key
   * @param Props
   * @returns
   */
  async render<TKey extends keyof typeof Component>(
    key: TKey,
    options?: {
      props?: Parameters<(typeof Component)[TKey]>[0]
      name: string
    }
  ) {
    // 选择组件
    const MyComponent = Component[key]
    // 使用参数
    const Props = (options.props ?? {}) as any
    // 截图
    return this.screenshot({
      // 地址
      join_dir: key,
      // 地址
      html_name: `${options?.name ?? 'help'}.html`,
      // ...
      ...CacheOptions,
      // body 内容
      html_body: <MyComponent {...Props} />
    })
  }
  //
}
//
export const picture = new ScreenshotPicture()
//
export * from './core/index.js'
