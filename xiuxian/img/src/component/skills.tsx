import { hash } from 'alemonjs'
import React from 'react'
import { createRequire, BackgroundImage } from 'react-puppeteer'
import { ThemesEmun } from '../core'
import { KkillInformationType } from 'xiuxian-statistics'
const require = createRequire(import.meta.url)

type PropsType = {
  data: KkillInformationType
  theme?: ThemesEmun
}

export default function App({ data, theme }: PropsType) {
  const UID = isNaN(Number(data.UID)) ? hash(data.UID) : data.UID
  return (
    <div
      id="root"
      data-theme={theme}
      style={{
        backgroundImage: 'var(--background-image)',
        backgroundSize: '100% auto'
      }}
    >
      <BackgroundImage
        className="w-full m-auto text-center"
        url={require('../../../../public/img/equipment.jpg')}
      >
        <div className="min-h-20"></div>
        <div className="">
          <div className="text-left mx-auto my-0">
            <div className=" text-white text-2xl p-3">{UID}</div>
            <div className=" text-white text-2xl p-3">道号: {data.name}</div>
            <div className=" text-white text-2xl p-3">
              灵根: {data.linggenName}
            </div>
            <div className=" text-white text-2xl p-3">
              天赋: {data.talentsize}
            </div>
          </div>
          <div className="">
            <div className="">
              <img className="" src={data.avatar} alt="User Avatar" />
            </div>
          </div>
        </div>
        <div className="rounded-lg w-full">
          <div className="pb-5">
            {data.skills.map(item => (
              <div key={item.id}>
                <div className=" text-white text-2xl p-3">
                  {item['good']['dataValues']['name']}
                </div>
                <div className=" text-white text-2xl latgrid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2tice">
                  <div>天赋: {item['good']['dataValues']['size']}%</div>
                  <div>
                    修为: +{item['good']['dataValues']['exp_gaspractice']}
                  </div>
                  <div>灵石: {item['good']['dataValues']['price']}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BackgroundImage>
    </div>
  )
}
