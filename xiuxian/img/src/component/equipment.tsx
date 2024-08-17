import { hash } from 'alemonjs'
import React from 'react'
import { ThemesEmun } from '../core'

type PropsType = {
  data: {
    UID: string
    avatar: string
    battle_attack: number
    battle_blood_limit: number
    battle_defense: number
    battle_speed: number
    battle_critical_hit: number
    battle_critical_damage: number
    equipment: any[]
    fate: any[]
    battle_power: number
  }
  theme?: ThemesEmun
}

/**
 *
 * @param param0
 * @returns
 */
export default function App({ data, theme }: PropsType) {
  const UID = isNaN(Number(data.UID)) ? hash(data.UID) : data.UID
  return (
    <div
      id="root"
      data-theme={theme}
      className="w-full m-auto text-center"
      style={{ backgroundImage: 'var(--background-image)' }}
    >
      <div style={{ height: '30px' }}></div>
      <div className="user_top">
        <div className="text-left mx-auto my-0">
          <div
            className="user_top_right_font0 text-white text-2xl p-3"
            style={{ borderTopRightRadius: '0px' }}
          >
            {UID}
          </div>
          <div
            className="user_top_right_font text-white text-2xl p-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 50%)'
            }}
          >
            <div className="whitespace-nowrap">攻击 : {data.battle_attack}</div>
            <div className="whitespace-nowrap">
              血量 : {data.battle_blood_limit}
            </div>
          </div>
          <div
            className="user_top_right_font1 text-white text-2xl p-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 50%)'
            }}
          >
            <div className="whitespace-nowrap">
              防御 : {data.battle_defense}
            </div>
            <div className="whitespace-nowrap">敏捷 : {data.battle_speed}</div>
          </div>
          <div
            className="user_top_right_font text-white text-2xl p-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 50%)'
            }}
          >
            <div className="whitespace-nowrap">
              暴击 : {data.battle_critical_hit}%
            </div>
            <div className="whitespace-nowrap">
              暴伤 : {data.battle_critical_damage}%
            </div>
          </div>
          <div
            className="user_top_right_font2 text-white text-2xl p-3"
            style={{ borderBottomRightRadius: '0px' }}
          >
            战力 : {data.battle_power}
          </div>
        </div>
        <div className="user_top_right">
          <div className="user_top_img_bottom">
            <img className="user_top_img" src={data.avatar} />
          </div>
        </div>
      </div>
      <div className="rounded-lg px-27 mx-auto">
        <div className="pb-5">
          {data.fate.map(item => (
            <div key={item.name}>
              <div
                className="user_top_right_font0 text-white text-2xl p-3"
                style={{ backgroundColor: 'rgb(61 18 12 / 84%)' }}
              >
                {item.name}[{item.grade}]
              </div>
              <div
                className="user_top_right_font1 text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2"
                style={{ backgroundColor: 'rgb(109 75 47 / 56%)' }}
              >
                <div className="whitespace-nowrap">攻击 : {item.attack}%</div>
                <div className="whitespace-nowrap">防御 : {item.defense}%</div>
                <div className="whitespace-nowrap">血量 : {item.blood}%</div>
              </div>
              <div
                className="user_top_right_font2 text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2"
                style={{
                  marginBottom: '5px',
                  backgroundColor: 'rgb(191 178 145 / 67%)'
                }}
              >
                <div className="whitespace-nowrap">
                  暴击 : {item.critical_hit}%
                </div>
                <div className="whitespace-nowrap">
                  暴伤 : {item.critical_damage}%
                </div>
                <div className="whitespace-nowrap">敏捷 : {item.speed}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg px-27 mx-auto">
        <div className="pb-5">
          {data.equipment.map(item => (
            <div key={item['good.name']}>
              <div className="user_top_right_font0 text-white text-2xl p-3">
                {item['good.name']}
              </div>
              <div className="user_top_right_font1 text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2">
                <div className="whitespace-nowrap">
                  攻击 : {item['good.attack']}%
                </div>
                <div className="whitespace-nowrap">
                  防御 : {item['good.defense']}%
                </div>
                <div className="whitespace-nowrap">
                  血量 : {item['good.blood']}%
                </div>
              </div>
              <div
                className="user_top_right_font2 text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2"
                style={{ marginBottom: '5px' }}
              >
                <div className="whitespace-nowrap">
                  暴击 : {item['good.critical_hit']}%
                </div>
                <div className="whitespace-nowrap">
                  暴伤 : {item['good.critical_damage']}%
                </div>
                <div className="whitespace-nowrap">
                  敏捷 : {item['good.speed']}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
