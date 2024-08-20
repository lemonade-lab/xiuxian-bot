import React from 'react'
import Header from './con/header.js'
import Footer from './con/footer.js'
import { ThemesEmun } from '../core/color.js'

type PropsType = {
  data: {
    version: string
    date: string
    message: string[]
  }[]
  theme?: ThemesEmun
}

/**
 *
 * @param param0
 * @returns
 */
export default function App({ data, theme }: PropsType) {
  return (
    <div
      id="root"
      data-theme={theme}
      className="bg-cover p-4"
      style={{
        backgroundImage: 'var(--background-image)',
        backgroundSize: '100% auto'
      }}
    >
      <div className="px-4">
        <Header list={['/修仙帮助', '/修仙配置']} />
      </div>
      <div className="px-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="my-4  py-1 text-white  bg-black bg-opacity-40 "
          >
            <div className="px-2 py-1 bg-black bg-opacity-40">
              日期： {item.date}{' '}
              <span className=" text-yellow-500">版本 {item.version}</span>
            </div>
            <div className="px-2 py-1">
              {item.message.map((item, index) => (
                <div key={index} className="py-2">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer
        list={['/功法信息', '/本命', '/勋章信息']}
        docs={'提示：任何物品都可以装备哦～'}
      />
      <div className="min-h-10"></div>
    </div>
  )
}
