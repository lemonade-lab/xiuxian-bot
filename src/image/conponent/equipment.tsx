import { hash } from 'alemonjs'
import React from 'react'

export default function App({ data }) {
  const UID = isNaN(Number(data.UID)) ? hash(data.UID) : data.UID
  return (
    <html>
      <head>
        <link rel="stylesheet" href="../css/root.css"></link>
        <link rel="stylesheet" href="../css/equipment.css"></link>
      </head>
      <body>
        <div id="app" className="user">
          <div style={{ height: '30px' }}></div>
          <div className="user_top">
            <div className="user_top_left">
              <div
                className="user_top_right_font0 font_control Horizontal_grid"
                style={{ borderTopRightRadius: '0px' }}
              >
                {UID}
              </div>
              <div
                className="user_top_right_font font_control Horizontal_grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 50%)'
                }}
              >
                <div className="font">攻击 : {data.battle_attack}</div>
                <div className="font">血量 : {data.battle_blood_limit}</div>
              </div>
              <div
                className="user_top_right_font1 font_control Horizontal_grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 50%)'
                }}
              >
                <div className="font">防御 : {data.battle_defense}</div>
                <div className="font">敏捷 : {data.battle_speed}</div>
              </div>
              <div
                className="user_top_right_font font_control Horizontal_grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 50%)'
                }}
              >
                <div className="font">暴击 : {data.battle_critical_hit}%</div>
                <div className="font">
                  暴伤 : {data.battle_critical_damage}%
                </div>
              </div>
              <div
                className="user_top_right_font2 font_control Horizontal_grid"
                style={{ borderBottomRightRadius: '0px' }}
              >
                战力 : {data.battle_power}
              </div>
            </div>
            <div className="user_top_right">
              <div className="user_top_img_bottom">
                <img className="user_top_img" src={data.avatar} />
              </div>
            </div>
          </div>
          <div className="user_bottom1">
            <div className="use_data">
              {data.fate.map(item => (
                <div key={item.name}>
                  <div
                    className="user_top_right_font0 font_control Horizontal_grid"
                    style={{ backgroundColor: 'rgb(61 18 12 / 84%)' }}
                  >
                    {item.name}[{item.grade}]
                  </div>
                  <div
                    className="user_top_right_font1 font_control lattice"
                    style={{ backgroundColor: 'rgb(109 75 47 / 56%)' }}
                  >
                    <div className="font">攻击 : {item.attack}%</div>
                    <div className="font">防御 : {item.defense}%</div>
                    <div className="font">血量 : {item.blood}%</div>
                  </div>
                  <div
                    className="user_top_right_font2 font_control lattice"
                    style={{
                      marginBottom: '5px',
                      backgroundColor: 'rgb(191 178 145 / 67%)'
                    }}
                  >
                    <div className="font">暴击 : {item.critical_hit}%</div>
                    <div className="font">暴伤 : {item.critical_damage}%</div>
                    <div className="font">敏捷 : {item.speed}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="user_bottom1">
            <div className="use_data">
              {data.equipment.map(item => (
                <div key={item['good.name']}>
                  <div className="user_top_right_font0 font_control Horizontal_grid">
                    {item['good.name']}
                  </div>
                  <div className="user_top_right_font1 font_control lattice">
                    <div className="font">攻击 : {item['good.attack']}%</div>
                    <div className="font">防御 : {item['good.defense']}%</div>
                    <div className="font">血量 : {item['good.blood']}%</div>
                  </div>
                  <div
                    className="user_top_right_font2 font_control lattice"
                    style={{ marginBottom: '5px' }}
                  >
                    <div className="font">
                      暴击 : {item['good.critical_hit']}%
                    </div>
                    <div className="font">
                      暴伤 : {item['good.critical_damage']}%
                    </div>
                    <div className="font">敏捷 : {item['good.speed']}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
