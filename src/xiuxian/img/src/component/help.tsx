import React from 'react'
import { BackgroundImage } from 'react-puppeteer'
import { ThemesEmun } from '../core/index.js'
import img_equipment from '@public/img/equipment.jpg'
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
  const _email = 'ningmengchongshui@gmail.com'
  const docs = 'https://docs.qq.com/doc/DSGFURU9IZmR4bUxK'
  const _QQ = '887314350'
  return (
    <div id="root" data-theme={theme}>
      <BackgroundImage url={img_equipment}>
        <div className="min-h-10"></div>
        <div className="text-xl m-8 px-6 p-4  rounded-md bg-black bg-opacity-20 text-center text-white relative shadow-lg font-semibold">
          <div className="text-red-500 text-left bg-white py-1 px-3 my-2 rounded-md bg-opacity-30">
            <div className="flex">
              <div className="w-32  text-blue-700">反馈邮箱</div>
              <div className="flex-1 text-2xl text-left  text-yellow-300 inline-block px-3 font-semibold">
                {_email}
              </div>
            </div>
            <div className="flex">
              <div className="w-32 text-blue-700">攻略</div>
              <div className="flex-1 text-2xl text-left  text-yellow-300 inline-block px-3 font-semibold">
                {docs}
              </div>
            </div>
            <div className="flex">
              <div className="w-32 text-blue-700">修仙交流群</div>
              <div className="flex-1 text-2xl text-left  text-yellow-300 inline-block px-3 font-semibold">
                {_QQ}
              </div>
            </div>
          </div>
          <div className="text-red-500 text-left bg-white py-1 px-3 my-2 rounded-md bg-opacity-70">
            使用 /修仙帮助1 查看第一页，使用 /修仙帮助2 查看第二页，以此类推
          </div>
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
