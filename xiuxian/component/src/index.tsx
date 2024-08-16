import React from 'react'
import { dirname, join } from 'path'
import { createRequire } from 'react-puppeteer'
import * as Component from './component/index.js'
import { Picture } from 'react-puppeteer'
const require = createRequire(import.meta.url)
const CssNameArray = [
  'new-defset',
  'new-information',
  'new-list',
  'new-bag',
  'new-equiment',
  'new-hello',
  'new-kill',
  'new-message',
  'new-nav',
  'new-root',
  'new-shopping',
  'new-ring',
  'new-skills',
  'new-sky',
  'new-help'
] as const

const ThemeArray = ['blue', 'dark', 'purple', 'red'] as const

/**
 *
 */
const paths = {
  // 定位自身的 md文件，并获取目录地址
  '@xiuxian': join(dirname(require('../../../README.md')), 'public')
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
      cssName?:
        | (typeof CssNameArray)[number]
        | Array<(typeof CssNameArray)[number]>
      theme?: (typeof ThemeArray)[number]
    }
  ) {
    const MyComponent = Component[key]
    const Props = (options.props ?? {}) as any
    // 截图
    return this.screenshot({
      join_dir: key,
      html_name: `${options?.name ?? 'help'}.html`,
      // 别名
      file_paths: paths,
      // 别名资源
      html_files: [
        require(`../../../public/css/root-${options?.theme ?? 'dark'}.css`)
      ],
      // 头部插入其他资源
      html_head: (
        <>
          {options?.cssName && Array.isArray(options?.cssName) ? (
            options.cssName.map((item, index) => (
              <link
                key={index}
                rel="stylesheet"
                href={require(`../../../public/css/${item}.css`)}
              />
            ))
          ) : (
            <link
              rel="stylesheet"
              href={require(`../../../public/css/${options.cssName}.css`)}
            />
          )}
        </>
      ),
      html_body: <MyComponent {...Props} />
    })
  }

  //
}
//
export const picture = new ScreenshotPicture()
//
export * from './core/index.js'
