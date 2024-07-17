import { hash } from 'alemonjs'
import React from 'react'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
import { BackgroundImage } from 'react-puppeteer'
export default function App({ data }) {
  return (
    <BackgroundImage
      id="app"
      className="user"
      url={require('../../../../public/img/information.jpg')}
    >
      {data.map((item, index) => (
        <div key={index} style={{ display: 'grid' }}>
          <BackgroundImage
            className="user_top"
            url={require('../../../../public/img/left.jpg')}
            size={'100% 100%'}
          >
            <div className="user_top_left">
              <div
                className="user_top_right_font0 font_control Horizontal_grid"
                style={{ padding: '5px' }}
              >
                {item.id}#{isNaN(Number(item.UID)) ? hash(item.UID) : item.UID}
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
              <BackgroundImage
                className="user_top_img_bottom"
                size={'100% 100%'}
                url={require('../../../../public/img/right.jpg')}
              >
                <img className="user_top_img" src={item.user_avatar} />
              </BackgroundImage>
            </div>
          </BackgroundImage>
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
    </BackgroundImage>
  )
}
