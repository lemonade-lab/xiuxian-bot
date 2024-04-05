import React from 'react'

export default function App({ data }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="../css/root.css"></link>
        <link rel="stylesheet" href="../css/skills.css" />
      </head>
      <body>
        <div id="app" className="user">
          <div style={{ height: '30px' }}></div>
          <div className="user_top">
            <div className="user_top_left">
              <div className="user_top_right_font0 font_control Horizontal_grid">
                {data.UID}
              </div>
              <div className="user_top_right_font font_control Horizontal_grid">
                道号: {data.name}
              </div>
              <div className="user_top_right_font1 font_control Horizontal_grid">
                灵根: {data.linggenName}
              </div>
              <div className="user_top_right_font2 font_control Horizontal_grid">
                天赋: {data.talentsize}
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
              {data.skills.map(item => (
                <div key={item.id}>
                  <div className="user_top_right_font0 font_control Horizontal_grid">
                    {item['good.name']}
                  </div>
                  <div
                    className="user_top_right_font2 font_control lattice"
                    style={{ marginBottom: '5px' }}
                  >
                    <div>天赋: {item['good.size']}%</div>
                    <div>修为: +{item['good.exp_gaspractice']}</div>
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
