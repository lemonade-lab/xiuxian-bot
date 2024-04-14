import React from 'react'
import { hash } from 'alemonjs'
export default function App({ data }) {
  const UID = isNaN(Number(data.uid)) ? hash(data.uid) : data.uid
  return (
    <html>
      <head>
        <link rel="stylesheet" href="../css/root.css"></link>
        <link rel="stylesheet" href="../css/sky.css" />
      </head>
      <body>
        <div id="app" className="user">
          {data.map(item => (
            <div key={item.id}>
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
                    <div className="user_top_img_bottom">
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
      </body>
    </html>
  )
}
