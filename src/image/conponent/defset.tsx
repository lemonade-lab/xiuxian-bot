import React from 'react'

export default function App({ data }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="../css/defset.css"></link>
      </head>
      <body>
        <div id="app" className="defset">
          <div className="defset-c"></div>
          <div className="Config-body">
            <div className="Config-body-title-re">
              <div className="Config-body-font">
                突破冷却: {data.CD_Level_up}m
              </div>
              <div className="Config-body-font">
                破体冷却: {data.CD_LevelMax_up}m
              </div>
              <div className="Config-body-font">
                道宣冷却: {data.CD_Autograph}m
              </div>
              <div className="Config-body-font">改名冷却: {data.CD_Name}m</div>
              <div className="Config-body-font">
                重生冷却: {data.CD_Reborn}m
              </div>
              <div className="Config-body-font">
                赠送冷却: {data.CD_Transfer}m
              </div>
              <div className="Config-body-font">
                攻击冷却: {data.CD_Attack}m
              </div>
              <div className="Config-body-font">击杀冷却: {data.CD_Kill}m</div>
              <div className="Config-body-font">
                修行冷却: {data.CD_Pconst_ractice}m
              </div>
              <div className="Config-body-font">偷袭冷却: {data.CD_Sneak}m</div>
              <div className="Config-body-font">
                双修冷却: {data.CD_Ambiguous}m
              </div>
              <div className="Config-body-font">
                比斗冷却: {data.CD_Battle}m
              </div>
              <div className="Config-body-font">
                传功冷却: {data.CD_transmissionPower}m
              </div>
            </div>
            <div className="Config-body-title-re">
              <div className="Config-body-font">
                闭关倍率: {data.biguan_size}
              </div>
              <div className="Config-body-font">锻体倍率: {data.work_size}</div>
              <div className="Config-body-font">
                最多功法持有数: {data.myconfig_gongfa}
              </div>
              <div className="Config-body-font">
                最多装备持有数: {data.myconfig_equipment}
              </div>
              <div className="Config-body-font">
                年龄每小时增加: {data.Age_size}
              </div>
              <div className="Config-body-font">
                储物袋最高等级: {data.Price.length - 1}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
