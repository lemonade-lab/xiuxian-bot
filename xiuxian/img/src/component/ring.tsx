import React from 'react'
import { nameMap } from '../core/public'
import { hash } from 'alemonjs'
import { createRequire, BackgroundImage } from 'react-puppeteer'
import { ThemesEmun } from '../core'

const require = createRequire(import.meta.url)

type PropsType = {
  data: {
    UID: string
    name: string
    bag_grade: number
    length: number
    bag: {
      id: number
      uid: string
      tid: number
      type: number
      name: string
      acount: number
      doc: number
    }[]
    avatar: string
  }
  theme?: ThemesEmun
}

export default function App({ data, theme }: PropsType) {
  const UID = isNaN(Number(data.UID)) ? hash(data.UID) : data.UID
  return (
    <div
      id="root"
      data-theme={theme}
      // style={{ backgroundImage: 'var(--background-image)' }}
    >
      <BackgroundImage
        className="w-full m-auto text-center"
        url={require('../../../../public/img/bag.jpg')}
      >
        <div style={{ height: '30px' }}></div>
        <div className="user_top">
          <div className="text-left mx-auto my-0">
            <div className="user_top_right_font0 text-white text-2xl p-3">
              {UID}
            </div>
            <div className="user_top_right_font1 text-white text-2xl p-3">
              道号: {data.name}
            </div>
            <div className="user_top_right_font text-white text-2xl p-3">
              等级: {data.bag_grade}
            </div>
            <div
              className="user_top_right_font2 text-white text-2xl p-3"
              style={{ borderBottomRightRadius: '0px' }}
            >
              格子: {data.length}/{data.bag_grade * 10}
            </div>
          </div>
          <div className="user_top_right">
            <div className="user_top_img_bottom">
              <img
                className="user_top_img"
                src={data.avatar}
                alt="User Avatar"
              />
            </div>
          </div>
        </div>
        <div className="rounded-lg w-full">
          <div className="pb-5">
            {data.bag.map(item => (
              <div key={item.id}>
                <div className="user_top_right_font0 text-white text-2xl p-3">
                  {item['good']['dataValues']['name']}
                </div>
                <div className="user_top_right_font1 text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2">
                  <div>攻击: {item['good']['dataValues']['attack']}%</div>
                  <div>防御: {item['good']['dataValues']['defense']}%</div>
                  <div>血量: {item['good']['dataValues']['blood']}%</div>
                </div>
                <div className="user_top_right_font text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2">
                  <div>天赋: {item['good']['dataValues']['size']}%</div>
                  <div>暴击: {item['good']['dataValues']['critical_hit']}%</div>
                  <div>
                    暴伤: {item['good']['dataValues']['critical_damage']}%
                  </div>
                </div>
                <div className="user_top_right_font1 text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2">
                  <div>敏捷: {item['good']['dataValues']['speed']}</div>
                  <div>
                    {nameMap[item['good']['dataValues']['addition']]}:{' '}
                    {
                      item['good']['dataValues'][
                        `${item['good']['dataValues']['addition']}`
                      ]
                    }
                    {item['good']['dataValues']['addition'] ===
                      'boolere_covery' && ' %'}
                  </div>
                  <div>五行: ???</div>
                </div>
                <div
                  className="user_top_right_font2 text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2"
                  style={{ marginBottom: '5px' }}
                >
                  <div>等级: {item['good']['dataValues']['grade']}</div>
                  <div>数量: {item['acount']}</div>
                  <div>灵石: {item['good']['dataValues']['price']}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BackgroundImage>
    </div>
  )
}
