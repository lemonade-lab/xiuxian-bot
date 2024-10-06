import React from 'react'
import Header from './con/header.js'
import Footer from './con/footer.js'
import css_output from '@public/output.css'
import { LinkStyleSheet } from 'jsxp'
import ThemeBackground, { ThemesEmun } from './con/ThemeBackground.js'

type PropsType = {
  data: any
  theme?: ThemesEmun
}

const CD_MAP = {
  CD_Level_up: '突破冷却',
  CD_LevelMax_up: '破体冷却',
  CD_Autograph: '道宣冷却',
  CD_Name: '改名冷却',
  CD_Reborn: '重生冷却',
  CD_Transfer: '赠送冷却',
  CD_Attack: '攻击冷却',
  CD_Kill: '击杀冷却',
  CD_Pconst_ractice: '修行冷却',
  CD_Sneak: '偷袭冷却',
  CD_Ambiguous: '双修冷却',
  CD_Battle: '比斗冷却',
  CD_transmissionPower: '传功冷却'
}

/**
 *
 * @param param0
 * @returns
 */

export default function App({ data, theme }: PropsType) {
  return (
    <html>
      <head>
        <LinkStyleSheet src={css_output} />
      </head>
      <body>
        <ThemeBackground
          id="root"
          className="w-full h-full p-4"
          data-theme={theme}
          theme={theme}
        >
          <div className="px-4">
            <Header list={['/修仙帮助', '/更新公告']} />
          </div>
          <div className="w-full h-full my-8 px-4  text-center">
            <div className="grid grid-cols-2 my-1 rounded-md bg-black bg-opacity-10">
              {Object.keys(CD_MAP).map((item, index) => (
                <div key={index} className="w-80 mx-auto text-3xl p-2">
                  {CD_MAP[item]}: {data[item]}m
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 my-1 rounded-md bg-black bg-opacity-10">
              {[
                `闭关倍率: ${data.biguan_size}`,
                `锻体倍率:  ${data.work_size}`,
                `最多功法持有数:  ${data.myconfig_gongfa}`,
                `最多装备持有数:  ${data.myconfig_equipment}`,
                `年龄每小时增加:  ${data.Age_size}`,
                `储物袋最高等级:  ${data.Price.length}`
              ].map((item, index) => (
                <div key={index} className="w-80 mx-auto text-3xl p-2">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <Footer />
          <div className="min-h-10"></div>
        </ThemeBackground>
      </body>
    </html>
  )
}
