import React from 'react'
import { BackgroundImage } from 'jsxp'
import { createUID } from '../core/index.js'
import img_information from '@src/assets/img/information.jpg'
import img_left from '@src/assets/img/left.jpg'
import img_right from '@src/assets/img/right.jpg'
import css_output from './XInformation.scss'
import { LinkStyleSheet } from 'jsxp'
import { ThemesEmun } from './con/ThemeBackground.js'
type PropsType = {
  data: any
  theme?: ThemesEmun
}

export default function App({ data, theme }: PropsType) {
  const UID = createUID(data.UID)
  return (
    <html>
      <head>
        <LinkStyleSheet src={css_output} />
      </head>
      <body>
        <BackgroundImage
          id="root"
          data-theme={theme}
          className="w-full m-auto text-center"
          url={img_information}
        >
          <div className="gridv">
            <BackgroundImage className="" size={'100% 100%'} url={img_left}>
              <div className="">
                <div className=" text-white text-2xl p-[5px]">{UID}</div>
                <div className=" text-white text-2xl p-[5px]">
                  道号: {data.name}
                </div>
                <div className=" text-white text-2xl p-[5px]">
                  血量: {data.battle_blood_now}/{data.battle_blood_limit}
                </div>
                <div className="  text-white text-2xl p-[5px]">
                  寿龄: {data.age}/{data.age_limit}
                </div>
              </div>
              <div className="">
                <BackgroundImage
                  className=""
                  size={'100% 100%'}
                  url={img_right}
                >
                  <img className="" src={data.avatar} />
                </BackgroundImage>
              </div>
            </BackgroundImage>
          </div>

          {/* 修心道宣 */}
          <div className="rounded-lg px-25 mx-auto">
            <div className="pb-5">
              <div className=" text-white text-2xl p-3">{'[修心道宣]'}</div>
              <div className=" text-white text-2xl p-3">{data.autograph}</div>
            </div>
          </div>

          {/* 个人信息 */}
          <div className="rounded-lg px-25 mx-auto">
            <div className="pb-5">
              <div className=" text-white text-2xl p-3">{'[个人信息]'}</div>
              <div className="">
                <div className="text-left pl-20 whitespace-nowrap">
                  灵力: {data.special_spiritual}/{data.special_spiritual_limit}
                </div>
                <div className="text-left pl-20 whitespace-nowrap">
                  煞气: {data.special_prestige}/100
                </div>
              </div>
              <div className="">
                <div className="text-left pl-20 whitespace-nowrap">
                  法境: {data.level?.gaspractice?.Name}
                </div>
                <div className="text-left pl-20 whitespace-nowrap">
                  修为: {data.level?.gaspractice?.Experience}/
                  {data.level?.gaspractice?.ExperienceLimit}
                </div>
              </div>
              <div className="">
                <div className="text-left pl-20 whitespace-nowrap">
                  体境: {data.level?.bodypractice?.Name}
                </div>
                <div className="text-left pl-20 whitespace-nowrap">
                  气血: {data.level?.bodypractice?.Experience}/
                  {data.level?.bodypractice?.ExperienceLimit}
                </div>
              </div>
              <div className="">
                <div className="text-left pl-20 whitespace-nowrap">
                  魂境: {data.level?.soul?.Name}
                </div>
                <div className="text-left pl-20 whitespace-nowrap">
                  神念: {data.level?.soul?.Experience}/
                  {data.level?.soul?.ExperienceLimit}
                </div>
              </div>
              <div className="">
                <div className="text-left pl-20 whitespace-nowrap">
                  声望: {data.special_reputation}
                </div>
                <div className="text-left pl-20 whitespace-nowrap">
                  战力: {data.battle_power}
                </div>
              </div>
              <div className="">
                <div className="text-left pl-20 whitespace-nowrap">
                  灵根: {data.linggenName}
                </div>
                <div className="text-left pl-20 whitespace-nowrap">
                  天赋: {data.talentsize}
                </div>
              </div>
              <div className=" text-white text-2xl p-3 grid grid-cols-4 gap-0">
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
              <div className=" text-white text-2xl p-3">{'[已学功法]'}</div>
              <div className=" text-white text-2xl p-3 grid grid-cols-4 gap-0">
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
      </body>
    </html>
  )
}
