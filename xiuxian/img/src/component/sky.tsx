import React from 'react'
import { hash } from 'alemonjs'
import { createRequire, BackgroundImage } from 'react-puppeteer'
import { ThemesEmun } from '../core'
const require = createRequire(import.meta.url)

type PropsType = {
  data: {
    id: number
    UID: string
    name: string
    power: number
    autograph: string
    avatar: string
  }[]
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
          <div key={index}>
            <div style={{ display: 'grid' }}>
              <BackgroundImage
                className=""
                size={'100% 100%'}
                url={require('../../../../public/img/left.jpg')}
              >
                <div className="">
                  <div className=" text-black text-2xl  p-[5px]">
                    {isNaN(Number(item.UID)) ? hash(item.UID) : item.UID}
                  </div>
                  <div className=" text-black text-2xl  p-[5px]">
                    道号: {item.name}
                  </div>
                  <div className=" text-black text-2xl  p-[5px]">
                    排名: {item.id}
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
                    <img className="" src={item.avatar} alt="User Avatar" />
                  </BackgroundImage>
                </div>
              </BackgroundImage>
            </div>
            <div className="rounded-lg w-full">
              <div className="pb-5">
                <div className=" text-black text-2xl p-3">{'[修心道宣]'}</div>
                <div className=" text-black text-2xl p-3">{item.autograph}</div>
              </div>
            </div>
          </div>
        ))}
        {data.length == 0 && (
          <>
            <div className="min-h-20"> </div>
            <div className="text-3xl font-bold"> 数据为空</div>
            <div className="min-h-20"> </div>
          </>
        )}
      </BackgroundImage>
    </div>
  )
}
