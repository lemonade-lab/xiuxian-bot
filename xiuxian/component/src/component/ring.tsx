import React from 'react'
import { nameMap } from '../core/public'
import { hash } from 'alemonjs'
import { BackgroundImage } from 'react-puppeteer'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
export default function App({ data }) {
  const UID = isNaN(Number(data.UID)) ? hash(data.UID) : data.UID
  return (
    <BackgroundImage
      id="app"
      className="user"
      url={require('../../../../public/img/bag.jpg')}
    >
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
            <img className="user_top_img" src={data.avatar} alt="User Avatar" />
          </div>
        </div>
      </div>
      <div className="user_bottom1">
        <div className="use_data">
          {data.bag.map(item => (
            <div key={item.id}>
              <div className="user_top_right_font0 font_control Horizontal_grid">
                {item['good']['dataValues']['name']}
              </div>
              <div className="user_top_right_font1 font_control lattice">
                <div>攻击: {item['good']['dataValues']['attack']}%</div>
                <div>防御: {item['good']['dataValues']['defense']}%</div>
                <div>血量: {item['good']['dataValues']['blood']}%</div>
              </div>
              <div className="user_top_right_font font_control lattice">
                <div>天赋: {item['good']['dataValues']['size']}%</div>
                <div>暴击: {item['good']['dataValues']['critical_hit']}%</div>
                <div>
                  暴伤: {item['good']['dataValues']['critical_damage']}%
                </div>
              </div>
              <div className="user_top_right_font1 font_control lattice">
                <div>敏捷: {item['good']['dataValues']['speed']}</div>
                <div>
                  {nameMap[item['good']['dataValues']['addition']]}:{' '}
                  {
                    item['good']['dataValues'][
                      `${item['good']['dataValues']['addition']}`
                    ]
                  }
                  {item['good']['dataValues']['addition'] ===
                    'boolere_covery' && ' %'}
                </div>
                <div>五行: ???</div>
              </div>
              <div
                className="user_top_right_font2 font_control lattice"
                style={{ marginBottom: '5px' }}
              >
                <div>等级: {item['good']['dataValues']['grade']}</div>
                <div>数量: {item['acount']}</div>
                <div>灵石: {item['good']['dataValues']['price']}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BackgroundImage>
  )
}
