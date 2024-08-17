import React from 'react'
import NavMessage from './con/nav.js'
import { ThemesEmun } from '../core/color.js'

type PropsType = {
  data: {
    UID: string
    avatar: string
    linggenName: string
    talentsize: string
    talent_show: number
    talent: number[]
    special_reputation: number
    battle_power: number

    // UserData
    name: string
    battle_blood_now: number
    battle_blood_limit: number
    age: number
    age_limit: number
    autograph: string
    special_spiritual: number
    special_spiritual_limit: number
    special_prestige: number

    level: {
      gaspractice: {
        Name: string
        Experience: number
        ExperienceLimit: number
      }
      bodypractice: {
        Name: string
        Experience: number
        ExperienceLimit: number
      }
      soul: {
        Name: string
        Experience: number
        ExperienceLimit: number
      }
    }
    skills: {
      id: number
      uid: string
      name: string
      doc: string
    }[]
    theme: ThemesEmun
  }
  theme?: ThemesEmun
}

export default function App({ data, theme }: PropsType) {
  const args = [
    '/突破',
    '/闭关',
    '/出关',
    '/打坐',
    '/聚灵',
    '/纳戒',
    '/本命',
    '/打劫@道友',
    '/双修@道友',
    '/比斗@道友',
    '/探索怪物',
    '/释放神识',
    '/储物袋',
    '/学习+功法名',
    '/服用+丹药名',
    '/装备+装备名'
  ]

  // console.log("data", data)

  return (
    <div
      id="root"
      data-theme={theme}
      style={{
        backgroundImage: 'var(--background-image)',
        backgroundSize: '100% auto'
      }}
    >
      <NavMessage data={data} />
      {
        //
      }
      <div className="p-4  text-white   pt-8 pr-4 pb-4 pl-4   relative">
        <div className="bg-[var(--bg-color)]  shadow-md  rounded-md relative px-4 py-2">
          <span className="text-2xl">{data.autograph}</span>
          <span className="text-white px-2 py-1 rounded-t-lg text-lg bg-slate-400 absolute top-[-36px] flex left-[12px]  shadow-md">
            /签名+字符
          </span>
        </div>
      </div>
      {
        //
      }
      <div className="p-4 text-2xl text-white   pt-8 pr-4 pb-4 pl-4   relative">
        <div className="bg-[var(--bg-color)] flex  shadow-md  rounded-md relative px-4 py-2">
          <div className="flex-1">
            <div className="  ">声望: {data.special_reputation}</div>
            <div className="  ">煞气: {data.special_prestige}/100</div>
            <div className="  ">
              <span>体境: {data.level?.bodypractice?.Name}</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="  ">
              气血: {data.level?.bodypractice?.Experience}/
              {data.level?.bodypractice?.ExperienceLimit}
            </div>
            <div className="  ">魂境: {data.level?.soul?.Name}</div>
            <div className="  ">
              神念: {data.level?.soul?.Experience}/
              {data.level?.soul?.ExperienceLimit}
            </div>
          </div>

          <span className="text-white px-2 py-1 rounded-t-lg text-lg bg-slate-400 absolute top-[-36px] flex left-[12px]  shadow-md">
            /面板信息
          </span>
        </div>
      </div>
      {
        //
      }
      {data.skills.length > 0 && (
        <div className="p-4  text-white   pt-8 pr-4 pb-4 pl-4   relative">
          <div className="bg-[var(--bg-color)]  shadow-md  rounded-md relative px-4 py-2">
            {data.skills.map((item, index) => (
              <span key={index}>《{item['name']}》 </span>
            ))}
            <span className="text-white px-2 py-1 rounded-t-lg text-lg bg-slate-400 absolute top-[-36px] flex left-[12px]  shadow-md">
              {' '}
              /功法信息
            </span>
          </div>
        </div>
      )}
      {
        //
      }
      <div className="p-4  text-white   pt-8 pr-4 pb-4 pl-4   relative">
        <div className=" bg-[var(--bg-color)] shadow-md   rounded-md p-1 relative flex flex-wrap box-help-box">
          <div className=" px-2 py-1 rounded-t-lg text-lg bg-slate-400 absolute top-[-36px] flex left-[12px]  shadow-md">
            /修仙帮助
          </div>
          {
            // 展示其他指令，最好能带解释
          }
          {args.map((item, index) => (
            <div
              key={index}
              className="bg-[#f9f2f2de] my-1 shadow-md text-[#635b5bfa] rounded-md text-md px-2 py-1 mx-1"
            >
              {item}
            </div>
          ))}
          <div className="bg-[#f9f2f2de] my-1 shadow-md text-[#635b5bfa] rounded-md text-md px-2 py-1 mx-1">
            新手指引：闭关提升修为，打怪可得丰富资源，采集灵矿获得大量灵石，也可通过灵石辅助修炼
          </div>
        </div>
      </div>
    </div>
  )
}
