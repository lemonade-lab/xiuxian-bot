import React from 'react'
import { ThemesEmun } from '../core/color.js'
import Footer from './con/footer.js'
import { AttributesType, user_ass } from 'xiuxian-db'
import { Config } from 'xiuxian-core'
import Header from './con/header.js'

type PropsType = {
  data: AttributesType<typeof user_ass>[]
  theme?: ThemesEmun
}

export default function AssMessage({ data, theme }: PropsType) {
  return (
    <div
      id="root"
      data-theme={theme}
      style={{
        backgroundImage: 'var(--background-image)',
        backgroundSize: '100% auto'
      }}
    >
      <div className="px-4">
        <Header list={['/势力信息', '/更新公告']} />
      </div>
      <div className="px-4 text-2xl text-white  relative">
        {data.map((item, index) => {
          const ass = item['ass']['dataValues']
          const assTyping = ass['ass_typing']['dataValues']
          // 待加入
          if (item.identity == Config.ASS_IDENTITY_MAP['9']) {
            return (
              <div
                key={index}
                className="my-2 rounded-md bg-slate-700 bg-opacity-40"
              >
                <div className="p-1">
                  {`[${ass['name']}](${assTyping[item.identity]})`}
                </div>
              </div>
            )
          } else {
            return (
              <div
                key={index}
                className="my-1 rounded-md bg-black bg-opacity-20"
              >
                <div className="bg-black bg-opacity-20 p-1">
                  {`[${ass['name']}](${ass['grade']})`}
                </div>
                <div className="p-1">
                  <div>{`身份 ${assTyping[item.identity]}`}</div>
                  <div>{`灵池 ${ass['property']}`}</div>
                  <div>{`活跃 ${ass['activation']}`}</div>
                  <div>{`名气 ${ass['fame']}`}</div>
                  <div>{`贡献 ${item.contribute}`}</div>
                </div>
              </div>
            )
          }
        })}
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
    </div>
  )
}
