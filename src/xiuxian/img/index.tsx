import React from 'react'
import { render } from 'jsxp'
import * as Component from './src/component/index.js'
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
    path: key,
    // 地址
    name: `${options?.name ?? 'help'}.html`,
    // html 组件
    component: <MyComponent {...Props} />
  })
}
export * from './src/core/index.js'
export { Component }
export { Themes } from './src/component/con/ThemeBackground.js'
