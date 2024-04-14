import { hash } from 'alemonjs'
import React from 'react'

export default function App({ data }) {
  const UID = Number(data.UID) ?? hash(data.UID)
  return (
    <html>
      <head>
        <link rel="stylesheet" href="../css/root.css"></link>
        <link rel="stylesheet" href="../css/information.css"></link>
      </head>
      <body>
        <div id="app" className="user">
          {/* 头部 */}
          <div style={{ display: 'grid' }}>
            <div className="user_top">
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
                <div className="user_top_img_bottom">
                  <img className="user_top_img" src={data.avatar} />
                </div>
              </div>
            </div>
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
                <div className="user_font_msg" style={{ color: data.color }}>
                  灵力: {data.special_spiritual}/{data.special_spiritual_limit}
                </div>
                <div className="user_font_msg" style={{ color: data.color }}>
                  煞气: {data.special_prestige}/100
                </div>
              </div>
              <div className="user_top_msg">
                <div className="user_font_msg" style={{ color: data.color }}>
                  法境: {data.level?.gaspractice?.Name}
                </div>
                <div className="user_font_msg" style={{ color: data.color }}>
                  修为: {data.level?.gaspractice?.Experience}/
                  {data.level?.gaspractice?.ExperienceLimit}
                </div>
              </div>
              <div className="user_top_msg">
                <div className="user_font_msg" style={{ color: data.color }}>
                  体境: {data.level?.bodypractice?.Name}
                </div>
                <div className="user_font_msg" style={{ color: data.color }}>
                  气血: {data.level?.bodypractice?.Experience}/
                  {data.level?.bodypractice?.ExperienceLimit}
                </div>
              </div>
              <div className="user_top_msg">
                <div className="user_font_msg" style={{ color: data.color }}>
                  魂境: {data.level?.soul?.Name}
                </div>
                <div className="user_font_msg" style={{ color: data.color }}>
                  神念: {data.level?.soul?.Experience}/
                  {data.level?.soul?.ExperienceLimit}
                </div>
              </div>
              <div className="user_top_msg">
                <div className="user_font_msg" style={{ color: data.color }}>
                  声望: {data.special_reputation}
                </div>
                <div className="user_font_msg" style={{ color: data.color }}>
                  战力: {data.battle_power}
                </div>
              </div>
              <div className="user_top_msg">
                <div className="user_font_msg" style={{ color: data.color }}>
                  灵根: {data.linggenName}
                </div>
                <div className="user_font_msg" style={{ color: data.color }}>
                  天赋: {data.talentsize}
                </div>
              </div>
              <div className="user_top_right_font2 font_control Horizontal_grid grid-4">
                {data.equipment.map(item => (
                  <div key={item['good.name']} style={{ color: data.color }}>
                    {item['good.name']}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 功法*/}
          <div className="user_bottom1">
            <div className="use_data">
              <div
                className="user_top_right_font0 font_control Horizontal_grid"
                style={{ color: data.color }}
              >
                {'[已学功法]'}
              </div>
              <div className="user_top_right_font2 font_control Horizontal_grid grid-4">
                {data.skills.map(item => (
                  <div key={item['good.name']} style={{ color: data.color }}>
                    《{item['good.name']}》
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 底部 */}
        </div>
      </body>
    </html>
  )
}
