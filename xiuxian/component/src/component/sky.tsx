import React from 'react'
import { hash } from 'alemonjs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
export default function App({ data }) {
  return (
    <div
      id="app"
      className="user"
      style={{
        backgroundImage: `url(${require('../../../../public/img/information.jpg')})`
      }}
    >
      {data.map((item, index) => (
        <div key={index}>
          <div style={{ display: 'grid' }}>
            <div
              className="user_top"
              style={{
                backgroundImage: `url(${require('../../../../public/img/left.jpg')})`
              }}
            >
              <div className="user_top_left">
                <div
                  className="user_top_right_font0 font_control Horizontal_grid"
                  style={{ padding: '5px' }}
                >
                  {isNaN(Number(item.UID)) ? hash(item.UID) : item.UID}
                </div>
                <div
                  className="user_top_right_font1 font_control Horizontal_grid"
                  style={{ padding: '5px' }}
                >
                  道号: {item.name}
                </div>
                <div
                  className="user_top_right_font2 font_control Horizontal_grid"
                  style={{ padding: '5px' }}
                >
                  排名: {item.id}
                </div>
                <div
                  className="user_top_right_font1 font_control Horizontal_grid"
                  style={{ padding: '5px' }}
                >
                  战力: {item.power}
                </div>
              </div>
              <div className="user_top_right">
                <div
                  className="user_top_img_bottom"
                  style={{
                    backgroundImage: `url(${require('../../../../public/img/right.jpg')})`
                  }}
                >
                  <img
                    className="user_top_img"
                    src={item.avatar}
                    alt="User Avatar"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="user_bottom1">
            <div className="use_data">
              <div className="user_top_right_font0 font_control Horizontal_grid">
                {'[修心道宣]'}
              </div>
              <div className="user_top_right_font2 font_control Horizontal_grid">
                {item.autograph}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
