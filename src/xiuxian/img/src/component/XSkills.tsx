import React from 'react'
import { BackgroundImage } from 'jsxp'
import { createUID } from '../core/index.js'
import { SkillInformationType } from '@xiuxian/statistics/index'
import Header from './con/header.js'
import Footer from './con/footer.js'
import img_equipment from '@src/assets/img/equipment.jpg'
import css_output from './XSkill.scss'
import { LinkStyleSheet } from 'jsxp'
import ThemeBackground, { ThemesEmun } from './con/ThemeBackground.js'
type PropsType = {
  data: SkillInformationType
  theme?: ThemesEmun
}
export default function App({ data, theme }: PropsType) {
  const UID = createUID(data.UID)
  return (
    <html>
      <head>
        <LinkStyleSheet src={css_output} />
      </head>
      <body>
        <ThemeBackground theme={theme}>
          <BackgroundImage className="w-full p-4" url={img_equipment}>
            <div className="p-4">
              <Header list={['/学习+功法名', '/忘掉+功法名']} />
            </div>
            <div className="rounded-lg w-full px-4 py-4">
              <div className="flex flex-row bg-black bg-opacity-30">
                <div className="flex-1 text-left mx-auto my-0 bg-black bg-opacity-20">
                  <div className=" text-white text-2xl p-3">{UID}</div>
                  <div className=" text-white text-2xl p-3">
                    道号: {data.name}
                  </div>
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
            <div className="rounded-lg w-full px-4 py-4">
              {data.skills.map((item, index) => {
                const good = item['good']['dataValues']
                return (
                  <div
                    key={index}
                    className=" my-4   bg-black bg-opacity-40 rounded-xl"
                  >
                    <div className="flex-1  px-4 py-2 bg-black bg-opacity-40 text-white text-2xl text-left">
                      {item.name}
                    </div>
                    <div className="flex  px-4 py-2 text-white text-2xl latgrid grid-cols-3 text-left grid-flow-col gap-0 pl-14 py-2tice">
                      <div className="flex-1">天赋: {good['size']}%</div>
                      <div className="flex-1">
                        修为: +{good['exp_gaspractice']}
                      </div>
                      <div className="flex-1">灵石: {good['price']}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <Footer
              list={['/面板信息', '/本命', '/勋章信息']}
              docs={'提示：任何物品都可以装备哦～'}
            />
          </BackgroundImage>
        </ThemeBackground>
      </body>
    </html>
  )
}
