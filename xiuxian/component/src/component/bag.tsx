import React from 'react'
import { nameMap } from '../core'
import { hash } from 'alemonjs'
export default function App({ data }) {
  const UID = isNaN(Number(data.UID)) ? hash(data.UID) : data.UID
  return (
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
            <img className="user_top_img" src={data.avatar} alt="User Avatar" />
          </div>
        </div>
      </nav>
      <main className="main">
        {data.bag.map((item, index) => (
          <div key={index} className="main-item">
            <div className="user_top_right_font0 font_control Horizontal_grid">
              {item['good']['dataValues']['name']}
            </div>
            <div className="user_top_right_font1 font_control lattice">
              {[
                `攻击: ${item['good']['dataValues']['attack']}%`,
                `防御: ${item['good']['dataValues']['defense']}%`,
                `血量: ${item['good']['dataValues']['blood']}%`
              ].map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
            <div className="user_top_right_font font_control lattice">
              {[
                `天赋: ${item['good']['dataValues']['size']}%`,
                `暴击: ${item['good']['dataValues']['critical_hit']}%`,
                `暴伤: ${item['good']['dataValues']['critical_damage']}%`
              ]}
            </div>
            <div className="user_top_right_font1 font_control lattice">
              <div>敏捷: {item['good']['dataValues']['speed']}</div>
              <div>
                {nameMap[item['good']['dataValues']['addition']]}:{' '}
                {item[`good.${item['good']['dataValues']['addition']}`]}
                {item['good']['dataValues']['addition'] ===
                  'boolere_covery' && <span> % </span>}
              </div>
              <div>五行: ???</div>
            </div>
            <div
              className="user_top_right_font2 font_control lattice"
              style={{ marginBottom: '5px' }}
            >
              {[
                `等级: ${item['good']['dataValues']['grade']}`,
                `数量: ${item.acount}`,
                `灵石: ${item['good']['dataValues']['price']}`
              ].map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
