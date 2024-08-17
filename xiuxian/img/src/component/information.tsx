import React from 'react'
import { hash } from 'alemonjs'
import { createRequire, BackgroundImage } from 'react-puppeteer'
import { ThemesEmun } from '../core'
const require = createRequire(import.meta.url)

type PropsType = {
  data: any
  theme?: ThemesEmun
}

export default function App({ data, theme }: PropsType) {
  const UID = isNaN(Number(data.UID)) ? hash(data.UID) : data.UID
  return (
    <div
      id="root"
      data-theme={theme}
      // style={{ backgroundImage: 'var(--background-image)' }}
    >
      <BackgroundImage
        className="w-full m-auto text-center"
        url={require('../../../../public/img/information.jpg')}
      >
        {/* 头部 */}
        <div style={{ display: 'grid' }}>
          <BackgroundImage
            className="user_top"
            size={'100% 100%'}
            url={require('../../../../public/img/left.jpg')}
          >
            <div className="user_top_left">
              <div
                className="user_top_right_font0 text-white text-2xl p-3"
                style={{ padding: '5px' }}
              >
                {UID}
              </div>
              <div
                className="user_top_right_font1 text-white text-2xl p-3"
                style={{ padding: '5px' }}
              >
                道号: {data.name}
              </div>
              <div
                className="user_top_right_font1 text-white text-2xl p-3"
                style={{ padding: '5px' }}
              >
                血量: {data.battle_blood_now}/{data.battle_blood_limit}
              </div>
              <div
                className="user_top_right_font2  text-white text-2xl p-3"
                style={{ padding: '5px' }}
              >
                寿龄: {data.age}/{data.age_limit}
              </div>
            </div>
            <div className="user_top_right">
              <BackgroundImage
                className="user_top_img_bottom"
                size={'100% 100%'}
                url={require('../../../../public/img/right.jpg')}
              >
                <img className="user_top_img" src={data.avatar} />
              </BackgroundImage>
            </div>
          </BackgroundImage>
        </div>

        {/* 修心道宣 */}
        <div className="rounded-lg px-25 mx-auto">
          <div className="pb-5">
            <div className="user_top_right_font0 text-white text-2xl p-3">
              {'[修心道宣]'}
            </div>
            <div className="user_top_right_font2 text-white text-2xl p-3">
              {data.autograph}
            </div>
          </div>
        </div>

        {/* 个人信息 */}
        <div className="rounded-lg px-25 mx-auto">
          <div className="pb-5">
            <div className="user_top_right_font0 text-white text-2xl p-3">
              {'[个人信息]'}
            </div>
            <div className="user_top_msg">
              <div className="text-left pl-20 whitespace-nowrap">
                灵力: {data.special_spiritual}/{data.special_spiritual_limit}
              </div>
              <div className="text-left pl-20 whitespace-nowrap">
                煞气: {data.special_prestige}/100
              </div>
            </div>
            <div className="user_top_msg">
              <div className="text-left pl-20 whitespace-nowrap">
                法境: {data.level?.gaspractice?.Name}
              </div>
              <div className="text-left pl-20 whitespace-nowrap">
                修为: {data.level?.gaspractice?.Experience}/
                {data.level?.gaspractice?.ExperienceLimit}
              </div>
            </div>
            <div className="user_top_msg">
              <div className="text-left pl-20 whitespace-nowrap">
                体境: {data.level?.bodypractice?.Name}
              </div>
              <div className="text-left pl-20 whitespace-nowrap">
                气血: {data.level?.bodypractice?.Experience}/
                {data.level?.bodypractice?.ExperienceLimit}
              </div>
            </div>
            <div className="user_top_msg">
              <div className="text-left pl-20 whitespace-nowrap">
                魂境: {data.level?.soul?.Name}
              </div>
              <div className="text-left pl-20 whitespace-nowrap">
                神念: {data.level?.soul?.Experience}/
                {data.level?.soul?.ExperienceLimit}
              </div>
            </div>
            <div className="user_top_msg">
              <div className="text-left pl-20 whitespace-nowrap">
                声望: {data.special_reputation}
              </div>
              <div className="text-left pl-20 whitespace-nowrap">
                战力: {data.battle_power}
              </div>
            </div>
            <div className="user_top_msg">
              <div className="text-left pl-20 whitespace-nowrap">
                灵根: {data.linggenName}
              </div>
              <div className="text-left pl-20 whitespace-nowrap">
                天赋: {data.talentsize}
              </div>
            </div>
            <div className="user_top_right_font2 text-white text-2xl p-3 grid grid-cols-4 gap-0">
              {data.equipment.map(item => (
                <div key={item['good']['dataValues']['name']}>
                  {item['good']['dataValues']['name']}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 功法*/}
        <div className="rounded-lg px-25 mx-auto">
          <div className="pb-5">
            <div className="user_top_right_font0 text-white text-2xl p-3">
              {'[已学功法]'}
            </div>
            <div className="user_top_right_font2 text-white text-2xl p-3 grid grid-cols-4 gap-0">
              {data.skills.map(item => (
                <div key={item['good']['dataValues']['name']}>
                  《{item['good']['dataValues']['name']}》
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 底部 */}
      </BackgroundImage>
    </div>
  )
}
