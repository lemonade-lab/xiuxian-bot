import { hash } from 'alemonjs'
import React from 'react'
import { createRequire, BackgroundImage } from 'react-puppeteer'
import { ThemesEmun } from '../core/index.js'
import { SkillInformationType } from 'xiuxian-statistics'
import Header from './con/header.js'
import Footer from './con/footer.js'
const require = createRequire(import.meta.url)

type PropsType = {
  data: SkillInformationType
  theme?: ThemesEmun
}

export default function App({ data, theme }: PropsType) {
  const UID = isNaN(Number(data.UID)) ? hash(data.UID) : data.UID

  // console.log("data.skills", data)

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
        className="w-full p-4"
        url={require('../../../../public/img/equipment.jpg')}
      >
        <div className="p-4">
          <Header list={['/学习+功法名', '/忘掉+功法名']} />
        </div>
        {
          //
        }

        <div className="rounded-lg w-full px-4 py-4">
          <div className="flex flex-row bg-black bg-opacity-30">
            <div className="flex-1 text-left mx-auto my-0 bg-black bg-opacity-20">
              <div className=" text-white text-2xl p-3">{UID}</div>
              <div className=" text-white text-2xl p-3">道号: {data.name}</div>
              <div className=" text-white text-2xl p-3">
                灵根: {data.linggenName}
              </div>
              <div className=" text-white text-2xl p-3">
                天赋: {data.talentsize}
              </div>
            </div>
            <div className="flex-1 flex">
              <img
                className="size-48 m-auto rounded-full"
                src={data.avatar}
                alt="User Agoodvatar"
              />
            </div>
          </div>
        </div>
        {
          //
        }

        <div className="rounded-lg w-full px-4 py-4">
          {data.skills.map((item, index) => (
            <div
              key={index}
              className=" my-4   bg-black bg-opacity-40 rounded-xl"
            >
              <div className="flex-1  px-4 py-2 bg-black bg-opacity-40 text-white text-2xl text-left">
                {item['good.name']}
              </div>
              <div className="flex  px-4 py-2 text-white text-2xl latgrid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2tice">
                <div className="flex-1">天赋: {item['good.size']}%</div>
                <div className="flex-1">
                  修为: +{item['good.exp_gaspractice']}
                </div>
                <div className="flex-1">灵石: {item['good.price']}</div>
              </div>
            </div>
          ))}
        </div>

        {
          //
        }
        <Footer
          list={['/面板信息', '/本命', '/勋章信息']}
          docs={'提示：任何物品都可以装备哦～'}
        />
      </BackgroundImage>
    </div>
  )
}
