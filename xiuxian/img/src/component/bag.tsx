import React from 'react'
import { nameMap, ThemesEmun } from '../core'
import { hash } from 'alemonjs'
import Nav from './con/Nav'

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
      style={{
        backgroundImage: 'var(--background-image)',
        backgroundSize: '100% auto'
      }}
      className="bg-cover bg-center p-4"
    >
      <Nav
        UID={UID}
        avatar={data.avatar}
        list={[
          `道号: ${data.name}`,
          `等级: ${data.bag_grade}`,
          `格子: ${data.length}/${data.bag_grade * 10}`
        ]}
      />
      <main className="my-4">
        {data.bag.map((item, index) => (
          <div key={index} className="bg-black bg-opacity-30">
            <div className=" bg-[#2c447594] text-white text-2xl p-3">
              {item['good']['dataValues']['name']}
            </div>
            <div className=" text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2">
              {[
                `攻击: ${item['good']['dataValues']['attack']}%`,
                `防御: ${item['good']['dataValues']['defense']}%`,
                `血量: ${item['good']['dataValues']['blood']}%`
              ].map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
            <div className=" text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2">
              {[
                `天赋: ${item['good']['dataValues']['size']}%`,
                `暴击: ${item['good']['dataValues']['critical_hit']}%`,
                `暴伤: ${item['good']['dataValues']['critical_damage']}%`
              ].map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
            <div className=" text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2">
              <div>敏捷: {item['good']['dataValues']['speed']}</div>
              <div>
                {nameMap[item['good']['dataValues']['addition']]}:{' '}
                {item[`good.${item['good']['dataValues']['addition']}`]}
                {item['good']['dataValues']['addition'] ===
                  'boolere_covery' && <span> % </span>}
              </div>
              <div>五行: ???</div>
            </div>
            <div
              className=" text-white text-2xl grid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2"
              style={{ marginBottom: '5px' }}
            >
              {[
                `等级: ${item['good']['dataValues']['grade']}`,
                `数量: ${item.acount}`,
                `灵石: ${item['good']['dataValues']['price']}`
              ].map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
