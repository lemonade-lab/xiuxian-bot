import { hash } from 'alemonjs'
import React from 'react'
import { createRequire, BackgroundImage } from 'react-puppeteer'
import { ThemesEmun } from '../core'
const require = createRequire(import.meta.url)

type PropsType = {
  data: any
  theme?: ThemesEmun
}

export default function App({ data, theme }: PropsType) {
  return (
    <div
      id="root"
      data-theme={theme}
      // style={{ backgroundImage: 'var(--background-image)' }}
    >
      <BackgroundImage
        className="user"
        url={require('../../../../public/img/information.jpg')}
      >
        {data.map(item => (
          <div key={item.UID} style={{ display: 'grid' }}>
            <BackgroundImage
              className="user_top"
              size={'100% 100%'}
              url={require('../../../../public/img/left.jpg')}
            >
              <div className="user_top_left">
                <div
                  className="user_top_right_font0 text-black text-2xl p-3"
                  style={{ padding: '5px' }}
                >
                  {isNaN(Number(item.UID)) ? hash(item.UID) : item.UID}
                </div>
                <div
                  className="user_top_right_font1 text-black text-2xl p-3"
                  style={{ padding: '5px' }}
                >
                  道号: {item.lifeName}
                </div>
                <div
                  className="user_top_right_font2 text-black text-2xl p-3"
                  style={{ padding: '5px' }}
                >
                  境界: {item.levelName}
                </div>
                <div
                  className="user_top_right_font1 text-black text-2xl p-3"
                  style={{ padding: '5px' }}
                >
                  战力: {item.power}
                </div>
              </div>
              <div className="user_top_right">
                <BackgroundImage
                  size={'100% 100%'}
                  url={require('../../../../public/img/right.jpg')}
                >
                  <img
                    className="user_top_img"
                    src={item.user_avatar}
                    alt="User Avatar"
                  />
                </BackgroundImage>
              </div>
            </BackgroundImage>
            <div className="rounded-lg w-full">
              <div className="pb-5">
                <div className="user_top_right_font0 text-black text-2xl p-3">
                  {'[修心道宣]'}
                </div>
                <div className="user_top_right_font2 text-black text-2xl p-3">
                  {item.autograph}
                </div>
              </div>
            </div>
          </div>
        ))}
      </BackgroundImage>
    </div>
  )
}
