import React from 'react'
import HeaderComponent from './header.js'
import { hash } from 'alemonjs'
import { createRequire } from 'react-puppeteer'
import { ThemesEmun } from '../../core/color.js'
const require = createRequire(import.meta.url)

const ThemesColor = {
  dark: {
    left: '#f3d109a6',
    right: '#ff0000ba'
  },
  red: {
    left: '#f7da2fa6',
    right: '#ff6800ba'
  },
  purple: {
    left: '#83e139ba',
    right: '#f72020cc'
  },
  blue: {
    left: '#aadb03ba',
    right: '#f72020ba'
  }
}

type PropsType = {
  data: {
    UID: string
    avatar: string
    //
    linggenName: string
    talentsize: string
    talent_show: number
    talent: number[]
    special_reputation: number
    battle_power: number
    // UserData
    name: string
    battle_blood_now: number
    battle_blood_limit: string
    age: string
    age_limit: string
    autograph: string
    special_spiritual: string
    special_spiritual_limit: string
    special_prestige: number
    //
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
}

/**
 *
 * @param param0
 * @returns
 */
export default function App({ data }: PropsType) {
  // 现在的血量   血量总量
  const pro = Math.floor((data.battle_blood_now / data.battle_blood_now) * 100)
  const color = `linear-gradient(to right, ${
    ThemesColor[data?.theme ?? 'dark'].left
  } ${pro}%,${ThemesColor[data?.theme ?? 'dark'].right}  ${pro}%)`
  const show = (a, b) => {
    if (
      data.talent_show &&
      (data.talent.includes(a) || data.talent.includes(b))
    ) {
      return 'initial'
    } else {
      return 'grayscale(100%)'
    }
  }
  const UID = isNaN(Number(data.UID)) ? hash(data.UID) : data.UID
  return (
    <div className="p-4">
      <HeaderComponent />
      <div className="nav-box p-4 pt-4 pb-8 rounded-t-xl flex justify-between relative mt-4">
        <span className="bg-gray-300 bg-opacity-70 text-gray-400 border-t-0 border-l-0 border-r-0 rounded-t-lg text-lg px-2 py-1 absolute top-0 left-0">
          /个人信息
        </span>
        <span
          className="text-white border-t-0 border-r-0 border-l-0 rounded-t-lg text-lg absolute flex right-0 top-0"
          style={{
            filter: data.talent_show ? 'initial' : 'grayscale(100%)'
          }}
        >
          <span
            className="nav-talent-item rounded-full m-0.5 p-6 border-2 border-white  bg-yellow-400 bg-opacity-50"
            style={{ filter: show(1, 6) }}
          >
            金
          </span>
          <span
            className="nav-talent-item  rounded-full m-0.5 p-6 border-2 border-white bg-green-600 bg-opacity-50"
            style={{ filter: show(2, 7) }}
          >
            木
          </span>
          <span
            className="nav-talent-item rounded-full m-0.5 p-6 border-2 border-white  bg-blue-600 bg-opacity-50"
            style={{ filter: show(3, 8) }}
          >
            水
          </span>
          <span
            className="nav-talent-item  rounded-full m-0.5 p-6 border-2 border-white bg-red-600 bg-opacity-50"
            style={{ filter: show(4, 9) }}
          >
            火
          </span>
          <span
            className="nav-talent-item  rounded-full m-0.5 p-6 border-2 border-white bg-indigo-600 bg-opacity-50"
            style={{ filter: show(5, 10) }}
          >
            土
          </span>
        </span>
        <div className="flex-1 m-auto">
          <div className="flex justify-center overflow-hidden whitespace-nowrap">
            <img
              className=" mr-[8px]"
              src={require('../../../../../public/svg/name.svg')}
            />
            <span>{data.name}</span>
          </div>
          <div className="flex justify-center overflow-hidden whitespace-nowrap">
            <img
              className="mr-[8px]"
              src={require('../../../../../public/svg/level.svg')}
            />
            <span>{data.level?.gaspractice?.Name}</span>
          </div>
          <div className="flex justify-center overflow-hidden whitespace-nowrap">
            {data.level?.gaspractice?.Experience}/
            {data.level?.gaspractice?.ExperienceLimit}
          </div>
        </div>
        <div className="flex-1 m-auto   relative   text-center">
          <img
            className="w-52 h-52 rounded-full border-2 border-white"
            src={data.avatar}
          />
          {/* {status && <span className="nav-state">闭关</span>} */}
          <div
            className="nav-box-uidwhitespace-nowrap overflow-hidden overflow-ellipsis absolute -m-2  text-center w-full left-0 text-[#ffffffe6] font-bold rounded-xl"
            style={{
              background: color
            }}
          >
            {UID}
          </div>
          <span className="absolute w-full bottom-0 text-center text-white bg-black rounded-bl-lg rounded-br-lg h-4 text-xs">{`${data.battle_blood_now}/${data.battle_blood_limit}-${pro}%`}</span>
        </div>
        <div className="flex-1 m-auto">
          {
            // 战力
          }
          <div className="flex justify-center overflow-hidden whitespace-nowrap">
            <img
              className="mr-[8px]"
              src={require('../../../../../public/svg/power.svg')}
            />
            <span>{data.battle_power}</span>
          </div>
          <div className="flex justify-center overflow-hidden whitespace-nowrap">
            <img
              className="mr-[8px]"
              src={require('../../../../../public/svg/efficiency.svg')}
            />
            <span>{data.talentsize}</span>{' '}
          </div>
          <div className="flex justify-center overflow-hidden whitespace-nowrap">
            {data.special_spiritual}/{data.special_spiritual_limit}
          </div>
        </div>
      </div>
    </div>
  )
}
