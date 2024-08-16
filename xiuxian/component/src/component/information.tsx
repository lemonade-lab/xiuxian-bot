import React from 'react'
import { hash } from 'alemonjs'
import { createRequire } from 'react-puppeteer'
import { BackgroundImage } from 'react-puppeteer'
const require = createRequire(import.meta.url)

export default function App({ data }) {
  const UID = isNaN(Number(data.UID)) ? hash(data.UID) : data.UID
  return (
    <BackgroundImage
      id="app"
      className="user"
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
              className="user_top_right_font0 font_control Horizontal_grid"
              style={{ padding: '5px' }}
            >
              {UID}
            </div>
            <div
              className="user_top_right_font1 font_control Horizontal_grid"
              style={{ padding: '5px' }}
            >
              道号: {data.name}
            </div>
            <div
              className="user_top_right_font1 font_control Horizontal_grid"
              style={{ padding: '5px' }}
            >
              血量: {data.battle_blood_now}/{data.battle_blood_limit}
            </div>
            <div
              className="user_top_right_font2 font_control Horizontal_grid"
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
      <div className="user_bottom1">
        <div className="use_data">
          <div className="user_top_right_font0 font_control Horizontal_grid">
            {'[修心道宣]'}
          </div>
          <div className="user_top_right_font2 font_control Horizontal_grid">
            {data.autograph}
          </div>
        </div>
      </div>

      {/* 个人信息 */}
      <div className="user_bottom1">
        <div className="use_data">
          <div className="user_top_right_font0 font_control Horizontal_grid">
            {'[个人信息]'}
          </div>
          <div className="user_top_msg">
            <div className="user_font_msg">
              灵力: {data.special_spiritual}/{data.special_spiritual_limit}
            </div>
            <div className="user_font_msg">
              煞气: {data.special_prestige}/100
            </div>
          </div>
          <div className="user_top_msg">
            <div className="user_font_msg">
              法境: {data.level?.gaspractice?.Name}
            </div>
            <div className="user_font_msg">
              修为: {data.level?.gaspractice?.Experience}/
              {data.level?.gaspractice?.ExperienceLimit}
            </div>
          </div>
          <div className="user_top_msg">
            <div className="user_font_msg">
              体境: {data.level?.bodypractice?.Name}
            </div>
            <div className="user_font_msg">
              气血: {data.level?.bodypractice?.Experience}/
              {data.level?.bodypractice?.ExperienceLimit}
            </div>
          </div>
          <div className="user_top_msg">
            <div className="user_font_msg">魂境: {data.level?.soul?.Name}</div>
            <div className="user_font_msg">
              神念: {data.level?.soul?.Experience}/
              {data.level?.soul?.ExperienceLimit}
            </div>
          </div>
          <div className="user_top_msg">
            <div className="user_font_msg">声望: {data.special_reputation}</div>
            <div className="user_font_msg">战力: {data.battle_power}</div>
          </div>
          <div className="user_top_msg">
            <div className="user_font_msg">灵根: {data.linggenName}</div>
            <div className="user_font_msg">天赋: {data.talentsize}</div>
          </div>
          <div className="user_top_right_font2 font_control Horizontal_grid grid-4">
            {data.equipment.map(item => (
              <div key={item['good']['dataValues']['name']}>
                {item['good']['dataValues']['name']}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 功法*/}
      <div className="user_bottom1">
        <div className="use_data">
          <div className="user_top_right_font0 font_control Horizontal_grid">
            {'[已学功法]'}
          </div>
          <div className="user_top_right_font2 font_control Horizontal_grid grid-4">
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
  )
}
