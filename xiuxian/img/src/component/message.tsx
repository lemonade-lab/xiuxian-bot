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
    autograph: string
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
  return (
    <div
      id="root"
      data-theme={theme}
      style={{ backgroundImage: 'var(--background-image)' }}
    >
      <NavMessage data={data} />
      <div className="p-8 pt-4 pb-2 pl-4">
        <div className="autograph-box relative px-4 py-2">
          <span>{data.autograph}</span>
          <span className="bg-gray-300 bg-opacity-70 text-gray-400 border-t-0 border-l-0 border-r-0 rounded-t-lg text-lg px-2 py-1 absolute top-0 left-0">
            /签名+字符
          </span>
        </div>
      </div>
      <div className="p-8 pt-8 pr-4 pb-4 pl-4">
        <div className="level-box">
          <span className="bg-gray-300 bg-opacity-70 text-gray-400 border-t-0 border-l-0 border-r-0 rounded-t-lg text-lg px-2 py-1 absolute top-0 left-0">
            /面板信息
          </span>
          <div className="flex flex-1  flex-grow-0">
            声望: {data.special_reputation}
          </div>
          <div className="flex flex-1  flex-grow-0">
            煞气: {data.special_prestige}/100
          </div>
          <div className="flex flex-1  flex-grow-0">
            <span>体境: {data.level?.bodypractice?.Name}</span>
          </div>
          <div className="flex flex-1  flex-grow-0">
            气血: {data.level?.bodypractice?.Experience}/
            {data.level?.bodypractice?.ExperienceLimit}
          </div>
          <div className="flex flex-1  flex-grow-0">
            魂境: {data.level?.soul?.Name}
          </div>
          <div className="flex flex-1  flex-grow-0">
            神念: {data.level?.soul?.Experience}/
            {data.level?.soul?.ExperienceLimit}
          </div>
        </div>
      </div>
      {data.skills.length > 0 && (
        <div className="p-8 pt-8 pr-4 pb-4 pl-4">
          <div className="kills-box flex flex-wrap">
            {data.skills.map((item, index) => (
              <span key={index}>《{item['name']}》 </span>
            ))}
            <span className="bg-gray-300 bg-opacity-70 text-gray-400 border-t-0 border-l-0 border-r-0 rounded-t-lg text-lg px-2 py-1 absolute top-0 left-0">
              /功法信息
            </span>
          </div>
        </div>
      )}
      <div className="p-8 pt-8 pr-4 pb-4 pl-4">
        <div className="p-1 relative flex flex-wrap box-help-box">
          <span className="bg-gray-300 bg-opacity-70 text-gray-400 border-t-0 border-l-0 border-r-0 rounded-t-lg text-lg px-2 py-1 absolute top-0 left-0">
            /修仙帮助
          </span>
          {['/突破', '/闭关', '/出关', '/储物袋', '/万宝楼', '/打劫@道友'].map(
            (item, index) => (
              <span key={index} className="menu-button">
                {item}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  )
}
