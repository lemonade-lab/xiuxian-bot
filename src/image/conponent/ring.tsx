import React from 'react'
import { nameMap } from '../core/public'
import { hash } from 'alemonjs'
export default function App({ data }) {
  const UID = isNaN(Number(data.uid)) ? hash(data.uid) : data.uid
  return (
    <html>
      <head>
        <link rel="stylesheet" href="../css/root.css"></link>
        <link rel="stylesheet" href="../css/ring.css" />
      </head>
      <body>
        <div id="app" className="user">
          <div style={{ height: '30px' }}></div>
          <div className="user_top">
            <div className="user_top_left">
              <div className="user_top_right_font0 font_control Horizontal_grid">
                {UID}
              </div>
              <div className="user_top_right_font1 font_control Horizontal_grid">
                道号: {data.name}
              </div>
              <div className="user_top_right_font font_control Horizontal_grid">
                等级: {data.bag_grade}
              </div>
              <div
                className="user_top_right_font2 font_control Horizontal_grid"
                style={{ borderBottomRightRadius: '0px' }}
              >
                格子: {data.length}/{data.bag_grade * 10}
              </div>
            </div>
            <div className="user_top_right">
              <div className="user_top_img_bottom">
                <img
                  className="user_top_img"
                  src={data.avatar}
                  alt="User Avatar"
                />
              </div>
            </div>
          </div>
          <div className="user_bottom1">
            <div className="use_data">
              {data.bag.map(item => (
                <div key={item.id}>
                  <div className="user_top_right_font0 font_control Horizontal_grid">
                    {item['good.name']}
                  </div>
                  <div className="user_top_right_font1 font_control lattice">
                    <div>攻击: {item['good.attack']}%</div>
                    <div>防御: {item['good.defense']}%</div>
                    <div>血量: {item['good.blood']}%</div>
                  </div>
                  <div className="user_top_right_font font_control lattice">
                    <div>天赋: {item['good.size']}%</div>
                    <div>暴击: {item['good.critical_hit']}%</div>
                    <div>暴伤: {item['good.critical_damage']}%</div>
                  </div>
                  <div className="user_top_right_font1 font_control lattice">
                    <div>敏捷: {item['good.speed']}</div>
                    <div>
                      {nameMap[item['good.addition']]}:{' '}
                      {item[`good.${item['good.addition']}`]}
                      {item['good.addition'] === 'boolere_covery' && ' %'}
                    </div>
                    <div>五行: ???</div>
                  </div>
                  <div
                    className="user_top_right_font2 font_control lattice"
                    style={{ marginBottom: '5px' }}
                  >
                    <div>等级: {item['good.grade']}</div>
                    <div>数量: {item['acount']}</div>
                    <div>价格: {item['good.price']}</div>
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
