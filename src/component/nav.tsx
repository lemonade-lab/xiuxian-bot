import React from 'react'
import HeaderComponent from './header.js'
import _ from './core/url.js'
import { PersonalInformationType } from '../server/information.js'
import { ThemesColor } from './core/color.js'
import { hash } from 'alemonjs'

export default function App({ data }: { data: PersonalInformationType }) {
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
    <div className="nav">
      <HeaderComponent />
      <div className="nav-box">
        <span className="menu-button-flat">#个人信息</span>
        <span
          className="nav-talent"
          style={{
            filter: data.talent_show ? 'initial' : 'grayscale(100%)'
          }}
        >
          <span
            className="nav-talent-item nav-talent-item-1"
            style={{
              filter: show(1, 6)
            }}
          >
            金
          </span>
          <span
            className="nav-talent-item nav-talent-item-2"
            style={{
              filter: show(2, 7)
            }}
          >
            木
          </span>
          <span
            className="nav-talent-item nav-talent-item-3"
            style={{
              filter: show(3, 8)
            }}
          >
            水
          </span>
          <span
            className="nav-talent-item nav-talent-item-4"
            style={{
              filter: show(4, 9)
            }}
          >
            火
          </span>
          <span
            className="nav-talent-item nav-talent-item-5"
            style={{
              filter: show(5, 10)
            }}
          >
            土
          </span>
        </span>
        <div className="nav-box-flex">
          <div className="nav-box-item">
            <img className="nav-box-item-img" src={_('svg/name.svg')} />
            <span>{data.name}</span>
          </div>
          <div className="nav-box-item">
            <img className="nav-box-item-img" src={_('svg/level.svg')} />
            <span>{data.level?.gaspractice?.Name}</span>
          </div>
          <div className="nav-box-item">
            {data.level?.gaspractice?.Experience}/
            {data.level?.gaspractice?.ExperienceLimit}
          </div>
        </div>
        <div className="nav-box-flex nav-box-avatar">
          <img className="nav-box-img" src={data.avatar} />
          {/* {status && <span className="nav-state">闭关</span>} */}
          <div
            className="nav-box-uid"
            style={{
              background: color
            }}
          >
            {UID}
          </div>
          <span className="nav-box-blool">{`${data.battle_blood_now}/${data.battle_blood_limit}-${pro}%`}</span>
        </div>
        <div className="nav-box-flex">
          {
            // 战力
          }
          <div className="nav-box-item">
            <img className="nav-box-item-img" src={_('svg/power.svg')} />
            <span>{data.battle_power}</span>
          </div>
          {/* <div className="nav-box-item">
            <img className="nav-box-item-img" src={_('svg/money.svg')} />
            <span>{data.money}</span>{' '}
          </div> */}
          {
            // 天赋
          }
          <div className="nav-box-item">
            <img className="nav-box-item-img" src={_('svg/efficiency.svg')} />
            <span>{data.talentsize}</span>{' '}
          </div>
          <div className="nav-box-item">
            {data.special_spiritual}/{data.special_spiritual_limit}
          </div>
        </div>
      </div>
    </div>
  )
}
