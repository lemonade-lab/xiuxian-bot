import React from 'react'
import NavMessage from './con/NavMessage.js'
import { ThemesEmun } from '../core/color.js'
import Footer from './con/footer.js'
import { PersonalInformationType } from 'xiuxian-statistics'

type PropsType = {
  data: PersonalInformationType
  theme?: ThemesEmun
}

export default function App({ data, theme }: PropsType) {
  return (
    <div
      id="root"
      data-theme={theme}
      style={{
        backgroundImage: 'var(--background-image)',
        backgroundSize: '100% auto'
      }}
    >
      <NavMessage data={data} />
      {
        //
      }
      <div className="p-4  text-white   pt-8 pr-4 pb-4 pl-4   relative">
        <div className="bg-[var(--bg-color)]  shadow-md  rounded-md relative px-4 py-2">
          <span className="text-2xl">{data.autograph}</span>
          <span className="text-white px-2 py-1 rounded-t-lg text-lg bg-slate-400 absolute top-[-36px] flex left-[12px]  shadow-md">
            /签名+字符
          </span>
        </div>
      </div>
      {
        //
      }
      <div className="p-4 text-2xl text-white   pt-8 pr-4 pb-4 pl-4   relative">
        <div className="bg-[var(--bg-color)] flex  shadow-md  rounded-md relative px-4 py-2">
          <div className="flex-1">
            <div className="  ">声望 {data.special_reputation}</div>
            <div className="  ">煞气 {data.special_prestige}/100</div>
            <div className="  ">体境 {data.level?.bodypractice?.Name} </div>
          </div>
          <div className="flex-1">
            <div className="  ">
              气血 {data.level?.bodypractice?.Experience}/
              {data.level?.bodypractice?.ExperienceLimit}
            </div>
            <div className="">魂境 {data.level?.soul?.Name}</div>
            <div className="">
              神念 {data.level?.soul?.Experience}/
              {data.level?.soul?.ExperienceLimit}
            </div>
          </div>
          <span className="text-white px-2 py-1 rounded-t-lg text-lg bg-slate-400 absolute top-[-36px] flex left-[12px]  shadow-md">
            /面板信息
          </span>
        </div>
      </div>
      {
        //
      }
      {data.skills.length > 0 && (
        <div className="p-4  text-white   pt-8 pr-4 pb-4 pl-4   relative">
          <div className="bg-[var(--bg-color)]  shadow-md  rounded-md relative px-4 py-2">
            {data.skills.map((item, index) => (
              <span key={index}>《{item['name']}》 </span>
            ))}
            <span className="text-white px-2 py-1 rounded-t-lg text-lg bg-slate-400 absolute top-[-36px] flex left-[12px]  shadow-md">
              {' '}
              /功法信息
            </span>
          </div>
        </div>
      )}
      {
        //
      }

      <Footer />
    </div>
  )
}
