import React from 'react'
import { nameMap } from './core'
import { hash } from 'alemonjs'
import _ from './core/url.js'
export default function App({ data }) {
  const UID = isNaN(Number(data.UID)) ? hash(data.UID) : data.UID
  return (
    <html>
      <head>
        <link rel="stylesheet" href={_('css/root.css')}></link>
        <link rel="stylesheet" href={_('css/root-dark.css')}></link>
        <link rel="stylesheet" href={_('css/bag.css')}></link>
      </head>
      <body>
        <div id="root">
          <nav className="nav">
            <div className="nav-left">
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
            <div className="nav-right">
              <div className="user_top_img_bottom">
                <img
                  className="user_top_img"
                  src={data.avatar}
                  alt="User Avatar"
                />
              </div>
            </div>
          </nav>

          <main className="main">
            {data.bag.map((item, index) => (
              <div key={index} className="main-item">
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
                    {item['good.addition'] === 'boolere_covery' && (
                      <span> % </span>
                    )}
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
          </main>
        </div>
      </body>
    </html>
  )
}
