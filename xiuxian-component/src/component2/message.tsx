import React from 'react'
import NavMessage from './nav.jsx'
import _ from '../core/url.js'
// import { PersonalInformationType } from '../server/information.js'

export default function App({ data }: { data }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href={_('css/output.css')}></link>
        <link rel="stylesheet" href={_('css/new-root.css')}></link>
        <link
          rel="stylesheet"
          href={_(`css/root-${data?.theme ?? 'dark'}.css`)}
        ></link>
        <link rel="stylesheet" href={_(`css/new-nav.css`)}></link>
        <link rel="stylesheet" href={_(`css/new-message.css`)}></link>
      </head>
      <body>
        <div id="root">
          <NavMessage data={data} />
          <div className="autograph">
            <div className="autograph-box">
              <span>{data.autograph}</span>
              <span className="menu-button-flat">/签名+字符</span>
            </div>
          </div>

          <div className="level">
            <div className="level-box">
              <span className="menu-button-flat">/面板信息</span>
              <div className="level-box-item">
                声望: {data.special_reputation}
              </div>
              <div className="level-box-item">
                煞气: {data.special_prestige}/100
              </div>
              <div className="level-box-item">
                <span>体境: {data.level?.bodypractice?.Name}</span>
              </div>
              <div className="level-box-item">
                气血: {data.level?.bodypractice?.Experience}/
                {data.level?.bodypractice?.ExperienceLimit}
              </div>
              <div className="level-box-item">
                魂境: {data.level?.soul?.Name}
              </div>
              <div className="level-box-item">
                神念: {data.level?.soul?.Experience}/
                {data.level?.soul?.ExperienceLimit}
              </div>
            </div>
          </div>
          {data.skills.length > 0 && (
            <div className="kills">
              <div className="kills-box flex flex-wrap">
                {data.skills.map((item, index) => (
                  <span key={index}>《{item['good.name']}》 </span>
                ))}
                <span className="menu-button-flat">/功法信息</span>
              </div>
            </div>
          )}
          <div className="box-help">
            <div className="box-help-box">
              <span className="menu-button-flat">/修仙帮助</span>
              <span className="menu-button">/突破</span>
              <span className="menu-button">/闭关</span>
              <span className="menu-button">/出关</span>
              <span className="menu-button">/储物袋</span>
              <span className="menu-button">/万宝楼</span>
              <span className="menu-button">/打劫@道友</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
