import React from 'react'
import { dirname, join } from 'path'
import { Picture } from 'alemonjs'
import { createRequire } from 'module'
import * as Component from './component/index.js'
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
class ImagePicture extends Picture {
  constructor() {
    super()
    this.Pup.start()
  }

  files = {
    blue: [require('../../../public/css/root-blue.css')],
    dark: [require('../../../public/css/root-dark.css')],
    purple: [require('../../../public/css/root-purple.css')],
    red: [require('../../../public/css/root-red.css')]
  }

  /**
   *
   */
  paths = {
    // 定位自身的 md文件，并获取目录地址
    '@xiuxian': join(dirname(require('../../../README.md')), 'public')
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
    const adr = this.Com.create(<MyComponent {...Props} />, {
      join_dir: key,
      html_name: `${options?.name ?? 'help'}.html`,
      // 别名
      file_paths: this.paths,
      // 别名资源
      html_files: [
        require(`../../../public/css/root-${options?.theme ?? 'dark'}.css`)
      ],
      // 头部插入其他资源
      html_head: this.Com.render(
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
      )
    })
    return this.Pup.render(adr)
  }
}
//
export const picture = new ImagePicture()
//
export * from './core/index.js'
