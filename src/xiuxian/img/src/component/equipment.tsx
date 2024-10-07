import React from 'react'
import { createUID } from '../core/index.js'
import Header from './con/header.js'
import Footer from './con/footer.js'
import { EquipmentInformationType } from '@xiuxian/statistics/index'
import css_output from '@src/input.css'
import { LinkStyleSheet } from 'jsxp'
import ThemeBackground, { ThemesEmun } from './con/ThemeBackground.js'
type PropsType = {
  data: EquipmentInformationType
  theme?: ThemesEmun
}
/**
 *
 * @param param0
 * @returns
 */
export default function App({ data, theme }: PropsType) {
  const UID = createUID(data.UID)
  return (
    <html>
      <head>
        <LinkStyleSheet src={css_output} />
      </head>
      <body>
        <ThemeBackground className="bg-cover p-4" theme={theme}>
          <div className="px-4">
            <Header list={['/装备+装备名', '/卸下+装备名']} />
          </div>
          <div className="px-4">
            <nav className="flex justify-between rounded-md w-full bg-black bg-opacity-30">
              <div className="flex-1 flex flex-col">
                <div className=" bg-black bg-opacity-30">
                  <div className=" bg-[#2c447594] text-white text-2xl p-3">
                    {UID}
                  </div>
                </div>
                <div className="flex-1 flex">
                  <img
                    className="size-56 rounded-full m-auto"
                    src={data.avatar}
                    alt="User Avatar"
                  />
                </div>
                <div className=" bg-black bg-opacity-30">
                  {[`战力 : ${data.battle_power}`].map((item, index) => (
                    <div key={index} className=" text-white text-2xl p-3">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 bg-black bg-opacity-30">
                {[
                  `攻击 : ${data.battle_attack}`,
                  `血量 : ${data.battle_blood_limit}`,
                  `敏捷 : ${data.battle_speed}`,
                  `防御 : ${data.battle_defense}`,
                  `暴击 : ${data.battle_critical_hit}%`,
                  `暴伤 : ${data.battle_critical_damage}%`
                ].map((item, index) => (
                  <div key={index} className=" text-white text-2xl p-3">
                    {item}
                  </div>
                ))}
              </div>
            </nav>
          </div>

          {data.fate.length > 0 && (
            <div className="rounded-md px-27  px-4 my-4 mx-auto ">
              {data.fate.map((item, index) => (
                <div key={index}>
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
                    <div className="whitespace-nowrap">
                      攻击 : {item.attack}%
                    </div>
                    <div className="whitespace-nowrap">
                      防御 : {item.defense}%
                    </div>
                    <div className="whitespace-nowrap">
                      血量 : {item.blood}%
                    </div>
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
          )}

          {
            //
          }
          <div className="px-4">
            <div className="rounded-md px-27 my-4 bg-black bg-opacity-30">
              <div className="pb-5">
                {data.equipment.map((item, index) => {
                  const good = item['good']['dataValues']
                  return (
                    <div key={index}>
                      <div className=" text-white text-2xl p-3 bg-black bg-opacity-30">
                        {item.name}
                      </div>
                      <div className=" text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2">
                        <div className="whitespace-nowrap">
                          攻击 : {good['attack']}%
                        </div>
                        <div className="whitespace-nowrap">
                          防御 : {good['defense']}%
                        </div>
                        <div className="whitespace-nowrap">
                          血量 : {good['blood']}%
                        </div>
                      </div>
                      <div
                        className=" text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2"
                        style={{ marginBottom: '5px' }}
                      >
                        <div className="whitespace-nowrap">
                          暴击 : {good['critical_hit']}%
                        </div>
                        <div className="whitespace-nowrap">
                          暴伤 : {good['critical_damage']}%
                        </div>
                        <div className="whitespace-nowrap">
                          敏捷 : {good['speed']}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <Footer
            list={['/功法信息', '/本命', '/勋章信息']}
            docs={'提示：任何物品都可以装备哦～'}
          />
          <div className="min-h-10"></div>
        </ThemeBackground>
      </body>
    </html>
  )
}
