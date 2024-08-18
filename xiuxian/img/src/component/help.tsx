import React from 'react'
import { createRequire, BackgroundImage } from 'react-puppeteer'
import { ThemesEmun } from '../core/index.js'

const require = createRequire(import.meta.url)

type PropsType = {
  data: {
    group: string
    list: {
      icon: number
      title: string
      desc: number
    }[]
  }[]
  theme?: ThemesEmun
}

export default function App({ data, theme }: PropsType) {
  const _QQ = '887314350'
  return (
    <div id="root" data-theme={theme}>
      <BackgroundImage url={require('../../../../public/img/equipment.jpg')}>
        <div className="min-h-10"></div>
        <div className="text-xl m-8 px-6 p-4  rounded-md bg-black bg-opacity-20 text-center text-white relative shadow-lg font-semibold">
          <span className=" text-blue-700">信息服务网</span>
          <span className="text-2xl  text-yellow-300 inline-block px-3 font-semibold">
            {'http://43.143.217.7/'}
          </span>
          <span className="text-blue-700">修仙交流群</span>
          <span className="text-2xl text-yellow-300 inline-block px-3 font-semibold">
            {_QQ}
          </span>
        </div>
        {data.map((val, index) => (
          <div
            key={index}
            className="rounded-md mb-5 ml-10 mr-10 overflow-hidden shadow-md relative bg-black bg-opacity-60"
          >
            <div className="text-white text-lg font-bold px-2 text-center">
              {val.group}
            </div>
            <div className="bg-white bg-opacity-90">
              {val.list.map((item, index) => (
                <div key={index} className="px-4 py-2">
                  <div className="flex">
                    <div className=" font-bold">{item.title}</div>
                    <div className="px-2">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="min-h-10"></div>
      </BackgroundImage>
    </div>
  )
}
