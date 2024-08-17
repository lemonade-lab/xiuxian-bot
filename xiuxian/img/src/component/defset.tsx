import React from 'react'
import { ThemesEmun } from '../core'

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
    <div
      id="root"
      data-theme={theme}
      className="w-full h-full text-center"
      style={{ backgroundImage: 'var(--background-image)' }}
    >
      <div className=" c min-h-[400px]"></div>
      <div className="  w-full h-full">
        <div className="grid grid-cols-2">
          {Object.keys(CD_MAP).map((item, index) => (
            <div key={index} className="w-80 mx-auto text-3xl p-2">
              {CD_MAP[item]}: {data[item]}m
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2">
          {[
            `闭关倍率: ${data.biguan_size}`,
            `锻体倍率:  ${data.work_size}`,
            `最多功法持有数:  ${data.myconfig_gongfa}`,
            `最多装备持有数:  ${data.myconfig_equipment}`,
            `年龄每小时增加:  ${data.Age_size}`,
            `储物袋最高等级:  ${data.Price.length - 1}`
          ].map((item, index) => (
            <div key={index} className="w-80 mx-auto text-3xl p-2">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
