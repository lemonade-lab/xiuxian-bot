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
    fate: {
      name: string
      grade: number
      attack: number
      defense: number
      blood: number
      critical_hit: number
      critical_damage: number
      speed: number
    }[]
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
      className="bg-cover bg-center p-4"
      style={{
        backgroundImage: 'var(--background-image)',
        backgroundSize: '100% auto'
      }}
    >
      {
        //
      }
      <nav className="flex justify-between w-full bg-black bg-opacity-30">
        <div className="flex-1 bg-black bg-opacity-30">
          <div className=" bg-[#2c447594] text-white text-2xl p-3">{UID}</div>
          {[
            `攻击 : ${data.battle_attack}`,
            `血量 : ${data.battle_blood_limit}`,
            `敏捷 : ${data.battle_speed}`,
            `防御 : ${data.battle_defense}`,
            `暴击 : ${data.battle_critical_hit}%`,
            `暴伤 : ${data.battle_critical_damage}%`,
            `战力 : ${data.battle_power}`
          ].map((item, index) => (
            <div key={index} className=" text-white text-2xl p-3">
              {item}
            </div>
          ))}
        </div>
        <div className="flex-1 flex">
          <img
            className="size-60 rounded-full m-auto"
            src={data.avatar}
            alt="User Avatar"
          />
        </div>
      </nav>

      {data.fate.length > 0 && (
        <div className="rounded-lg px-27  my-4 mx-auto ">
          <div className="pb-5">
            {data.fate.map(item => (
              <div key={item.name}>
                <div
                  className=" text-white text-2xl p-3 bg-black bg-opacity-30"
                  style={{ backgroundColor: 'rgb(61 18 12 / 84%)' }}
                >
                  {item.name}[{item.grade}]
                </div>
                <div
                  className=" text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2"
                  style={{ backgroundColor: 'rgb(109 75 47 / 56%)' }}
                >
                  <div className="whitespace-nowrap">攻击 : {item.attack}%</div>
                  <div className="whitespace-nowrap">
                    防御 : {item.defense}%
                  </div>
                  <div className="whitespace-nowrap">血量 : {item.blood}%</div>
                </div>
                <div
                  className=" text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2"
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
      )}

      {
        //
      }
      <div className="rounded-lg px-27 my-4 bg-black bg-opacity-30">
        <div className="pb-5">
          {data.equipment.map(item => (
            <div key={item['good.name']}>
              <div className=" text-white text-2xl p-3 bg-black bg-opacity-30">
                {item['good.name']}
              </div>
              <div className=" text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2">
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
                className=" text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2"
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
      {
        //
      }
      <div className="min-h-20"></div>
    </div>
  )
}
