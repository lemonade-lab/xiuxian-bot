import React from 'react'

export default function App({ data }) {
  return (
    <head>
      <head>
        <link rel="stylesheet" href="../css/kill.css" />
      </head>
      <body>
        <div id="app" className="user">
          {data.map(item => (
            <div key={item.UID} style={{ display: 'grid' }}>
              <div className="user_top">
                <div className="user_top_left">
                  <div
                    className="user_top_right_font0 font_control Horizontal_grid"
                    style={{ padding: '5px' }}
                  >
                    {item.UID}
                  </div>
                  <div
                    className="user_top_right_font1 font_control Horizontal_grid"
                    style={{ padding: '5px' }}
                  >
                    道号: {item.lifeName}
                  </div>
                  <div
                    className="user_top_right_font2 font_control Horizontal_grid"
                    style={{ padding: '5px' }}
                  >
                    煞气: {item.prestige}
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
                    <img className="user_top_img" src={item.user_avatar} />
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
    </head>
  )
}
