import React from 'react'
import { BackgroundImage } from 'jsxp'
import img_equipment from '@src/assets/img/equipment.jpg'
import css_output from './XHelp.scss'
import { LinkStyleSheet } from 'jsxp'
import { ThemesEmun } from './con/ThemeBackground.js'
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
    <html>
      <head>
        <LinkStyleSheet src={css_output} />
      </head>
      <body>
        <BackgroundImage id="root" data-theme={theme} url={img_equipment}>
          <div className="min-h-10"></div>
          <div className="text-xl m-8 p-2  rounded-md bg-black bg-opacity-20 text-center text-white relative shadow-lg font-semibold">
            <div className="text-red-500 text-left  py-1 px-3 my-2 rounded-md  bg-white">
              <div className="flex">
                <div className="w-32  text-green-500">反馈邮箱</div>
                <div className="flex-1 text-2xl text-left  text-yellow-500 inline-block px-3 font-semibold">
                  {_email}
                </div>
              </div>
              <div className="flex">
                <div className="w-32 text-green-500">攻略</div>
                <div className="flex-1 text-2xl text-left  text-yellow-500 inline-block px-3 font-semibold">
                  {docs}
                </div>
              </div>
              <div className="flex">
                <div className="w-32 text-green-500">Q群</div>
                <div className="flex-1 text-2xl text-left  text-yellow-500 inline-block px-3 font-semibold">
                  {_QQ}
                </div>
              </div>
            </div>
            <div className="text-red-500 text-left bg-white py-1 px-3 my-2 rounded-md">
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
      </body>
    </html>
  )
}
