import React from 'react'
import Header from './header.js'
import { hash } from 'alemonjs'
import { ThemesEmun } from '../../core/color.js'
import classNames from 'classnames'

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
    battle_blood_limit: number
    age: number
    age_limit: number
    autograph: string
    special_spiritual: number
    special_spiritual_limit: number
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
export default function NavMessage({ data }: PropsType) {
  // 现在的血量   血量总量
  const pro = Math.floor((data.battle_blood_now / data.battle_blood_now) * 100)
  //
  const color = `linear-gradient(to right, ${
    ThemesColor[data?.theme ?? 'dark'].left
  } ${pro}%,${ThemesColor[data?.theme ?? 'dark'].right}  ${pro}%)`
  /**
   *
   * @param a
   * @returns
   */
  const show = (a: number) => {
    const b = a + 5
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
  const List = [
    {
      title: '金',
      className: 'bg-yellow-500',
      style: {
        filter: show(1)
      }
    },
    {
      title: '木',
      className: 'bg-green-500',
      style: {
        filter: show(2)
      }
    },
    {
      title: '水',
      className: 'bg-blue-500',
      style: {
        filter: show(3)
      }
    },
    {
      title: '火',
      className: 'bg-red-500',
      style: {
        filter: show(4)
      }
    },
    {
      title: '土',
      className: 'bg-indigo-500',
      style: {
        filter: show(5)
      }
    }
  ]

  return (
    <div className="p-4 text-white">
      <Header />
      <div className="bg-[var(--bg-color)]  mt-10 nav-box p-4 pt-4 pb-8 rounded-t-xl flex justify-between relative">
        {
          //
        }
        <span className="text-white px-2 py-1 rounded-t-lg text-lg bg-slate-400 absolute top-[-36px] flex left-[12px]  shadow-md">
          /个人信息
        </span>
        {
          //
        }
        <span className="text-white rounded-t-lg text-lg absolute top-[-23px] flex right-0">
          {List.map((item, index) => (
            <span
              key={index}
              className={classNames(
                'rounded-full m-1 size-8 text-center shadow border-2 border-white ',
                item.className
              )}
              style={item.style}
            >
              {item.title}
            </span>
          ))}
        </span>

        {
          // 1
        }

        <div className="flex-1  text-2xl m-auto">
          <div className="flex justify-center overflow-hidden whitespace-nowrap">
            <span className="  font-bold ">{data.name}</span>
          </div>
          <div className="flex justify-center overflow-hidden whitespace-nowrap">
            <span>{data.level?.gaspractice?.Name}</span>
          </div>
          <div className="flex justify-center overflow-hidden whitespace-nowrap">
            {data.level?.gaspractice?.Experience}/
            {data.level?.gaspractice?.ExperienceLimit}
          </div>
        </div>

        {
          // 2
        }
        <div className="flex-1 m-auto relative text-center">
          <img
            className="w-52 h-52 m-auto rounded-full border-2 border-white"
            src={data.avatar}
          />
          {
            // 血条
          }
          <div
            className="absolute nav-box-uidwhitespace-nowrap text-3xl text-center w-full bottom-0 text-[#ffffffe6] font-bold rounded-xl"
            style={{ background: color }}
          >
            {UID}
          </div>

          <div className="absolute nav-box-uidwhitespace-nowrap  text-center w-full text-[#ffffffe6] font-bold rounded-xl">
            {`${data.battle_blood_now}/${data.battle_blood_limit}-${pro}%`}
          </div>
          {
            // 百分比
          }
        </div>

        {
          // 3
        }
        <div className="flex-1 m-auto text-2xl  text-left">
          {
            // 战力
          }
          <div className=" overflow-hidden whitespace-nowrap">
            <span> 战力 {data.battle_power}</span>
          </div>
          <div className=" overflow-hidden whitespace-nowrap">
            <span>天赋 {data.talentsize}</span>{' '}
          </div>
          <div className=" overflow-hidden whitespace-nowrap">
            灵力 {data.special_spiritual}/{data.special_spiritual_limit}
          </div>
        </div>
      </div>
    </div>
  )
}
