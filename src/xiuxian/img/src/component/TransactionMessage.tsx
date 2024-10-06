import React from 'react'
import { BackgroundImage } from 'jsxp'
import Header from './con/header.js'
import { AttributesType, transactions } from '@xiuxian/db/index'
import img_equipment from '@src/assets/img/equipment.jpg'
import css_output from '@public/output.css'
import { LinkStyleSheet } from 'jsxp'
import ThemeBackground from './con/ThemeBackground.js'
import { ThemesEmun } from '../core/color.js'
type PropsType = {
  data: {
    page: number
    goods: AttributesType<typeof transactions>[]
  }
  theme?: ThemesEmun
}
export default function TransactionMessage({ data, theme }: PropsType) {
  return (
    <html>
      <head>
        <LinkStyleSheet src={css_output} />
      </head>
      <body>
        <ThemeBackground theme={theme}>
          <BackgroundImage className="w-full p-4" url={img_equipment}>
            <div className="p-4">
              <Header
                Title={`虚空镜-第${data.page}页`}
                list={['/虚空镜*1', '/选购XXX', '/下架XXX']}
              />
            </div>
            <div className="rounded-lg w-full px-4 py-4">
              {data.goods.map((item, index) => (
                <div
                  key={index}
                  className=" my-4   bg-black bg-opacity-40 rounded-xl"
                >
                  <div className="flex-1  px-4 py-2 bg-black bg-opacity-40 text-white text-2xl text-left">
                    {item.name}
                  </div>
                  <div className="flex  px-4 py-2 text-white text-2xl latgrid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2tice">
                    <div className="flex-1">编号: {item.id}</div>
                    <div className="flex-1">价格: {item.price}</div>
                    <div className="flex-1">数量: {item.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </BackgroundImage>
        </ThemeBackground>
      </body>
    </html>
  )
}
