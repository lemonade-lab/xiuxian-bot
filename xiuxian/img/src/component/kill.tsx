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
    <div id="root" data-theme={theme}>
      <BackgroundImage
        className="w-full m-auto text-center"
        url={require('../../../../public/img/information.jpg')}
      >
        {data.map((item, index) => (
          <div key={index} style={{ display: 'grid' }}>
            <BackgroundImage
              className=""
              url={require('../../../../public/img/left.jpg')}
              size={'100% 100%'}
            >
              <div className="">
                <div className=" text-black text-2xl p-[5px]">
                  {item.id}#
                  {isNaN(Number(item.UID)) ? hash(item.UID) : item.UID}
                </div>
                <div className=" text-black text-2xl  p-[5px]">
                  道号: {item.lifeName}
                </div>
                <div className=" text-black text-2xl p-[5px]">
                  煞气: {item.prestige}
                </div>
                <div className=" text-black text-2xl  p-[5px]">
                  战力: {item.power}
                </div>
              </div>
              <div className="">
                <BackgroundImage
                  className=""
                  size={'100% 100%'}
                  url={require('../../../../public/img/right.jpg')}
                >
                  <img className="" src={item.user_avatar} />
                </BackgroundImage>
              </div>
            </BackgroundImage>
            <div className="rounded-lg w-full">
              <div className="pb-5">
                <div className=" text-black text-2xl p-3">{'[修心道宣]'}</div>
                <div className=" text-black text-2xl p-3">{item.autograph}</div>
              </div>
            </div>
          </div>
        ))}
      </BackgroundImage>
    </div>
  )
}
