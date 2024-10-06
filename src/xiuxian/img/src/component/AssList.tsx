import React from 'react'
import Footer from './con/footer.js'
import { ass, AttributesType } from '@xiuxian/db/index'
import Header from './con/header.js'

import css_output from '@public/output.css'
import { LinkStyleSheet } from 'jsxp'
import ThemeBackground, { ThemesEmun } from './con/ThemeBackground.js'

type PropsType = {
  data: AttributesType<typeof ass>[]
  theme?: ThemesEmun
}

export default function AssList({ data, theme }: PropsType) {
  return (
    <html>
      <head>
        <LinkStyleSheet src={css_output} />
      </head>
      <body>
        <ThemeBackground theme={theme}>
          <div className="px-4">
            <Header list={['/势力信息', '/更新公告']} />
          </div>
          <div className="px-4 text-2xl text-white  relative">
            {data.map((item, index) => (
              <div
                key={index}
                className="my-1 rounded-md bg-black bg-opacity-20"
              >
                <div className="bg-black bg-opacity-20 p-1">
                  {`[${item.name}](${item.grade})`}
                </div>
                <div className="p-1">
                  <div>{`活跃 ${item.activation}`}</div>
                  <div>{`名气 ${item.fame}`}</div>
                </div>
              </div>
            ))}
          </div>
          <Footer
            list={[
              '/审核',
              '/通过',
              '/踢出',
              '/扩建',
              '/扩建宝库',
              '/提拔',
              '/贬职',
              '/建立',
              '/解散',
              '/加入',
              '/退出',
              '/查看',
              '/势力'
            ]}
            docs={'新手指引:XXX'}
          />
        </ThemeBackground>
      </body>
    </html>
  )
}
