import { APlugin, Controllers, type AEvent } from 'alemonjs'
import { levelUp,postHelp} from '../../api/index.js'
export class Level extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?突破$/, fnc: 'breakThrough' },
        { reg: /^(#|\/)?破境$/, fnc: 'breakingTheBoundary' },
        { reg: /^(#|\/)?(顿悟|頓悟)$/, fnc: 'insight' }
      ]
    })
  }

  /**
   * 突破
   * @param e
   * @returns
   */
  async breakThrough(e: AEvent) {
    levelUp(e, 6, 1, 90)
    this.buttons(e)
    return
  }

  async buttons(e: AEvent) {
    if (e.platform == 'ntqq') {
      Controllers(e).Message.reply('', [
        { label: '修仙帮助', value: '/修仙帮助' },
        { label: '地图', value: '/地图' },
        { label: '控制板', value: '/控制板' }
      ])
      postHelp(e,"[{\"group\":\"战斗\",\"list\":[{\"icon\":21,\"title\":\"/打劫@道友\",\"desc\":\"若在城里需决斗令\"},{\"icon\":39,\"title\":\"/击杀+怪物名\",\"desc\":\"随机掉落物品\"},{\"icon\":68,\"title\":\"/探索怪物\",\"desc\":\"查看所在地的怪物\"},{\"icon\":68,\"title\":\"/战斗过程(开启|关闭)\",\"desc\":\"默认关闭战斗过程\"},{\"icon\":68,\"title\":\"/挑战妖塔\",\"desc\":\"刷取渡劫材料\"}]},{\"group\":\"提升战力\",\"list\":[{\"icon\":14,\"title\":\"/闭关\",\"desc\":\"进行闭关\"},{\"icon\":14,\"title\":\"/出关\",\"desc\":\"增加修为\"},{\"icon\":21,\"title\":\"/锻体\",\"desc\":\"进行锻体\"},{\"icon\":21,\"title\":\"/凝脉\",\"desc\":\"锻炼气血\"},{\"icon\":21,\"title\":\"/打坐\",\"desc\":\"聚集灵气\"},{\"icon\":21,\"title\":\"/聚灵\",\"desc\":\"凝聚体内\"},{\"icon\":8,\"title\":\"/炼化+物品名\",\"desc\":\"炼化物品未本命物\"},{\"icon\":8,\"title\":\"/精炼\",\"desc\":\"强化本命物\"},{\"icon\":8,\"title\":\"/突破\",\"desc\":\"练气升级\"},{\"icon\":8,\"title\":\"/破境\",\"desc\":\"练体升级\"}]},{\"group\":\"其它\",\"list\":[{\"icon\":16,\"title\":\"/战斗帮助\",\"desc\":\"战斗系统\"},{\"icon\":16,\"title\":\"/地图帮助\",\"desc\":\"地图系统\"},{\"icon\":16,\"title\":\"/联盟帮助\",\"desc\":\"联盟系统\"},{\"icon\":8,\"title\":\"/黑市帮助\",\"desc\":\"交易系统\"},{\"icon\":16,\"title\":\"/修炼帮助\",\"desc\":\"修炼系统\"},{\"icon\":16,\"title\":\"/职业帮助\",\"desc\":\"职业系统\"},{\"icon\":16,\"title\":\"/势力帮助\",\"desc\":\"势力系统\"}]}]")
    }
  }

  /**
   * 破境
   * @param e
   * @returns
   */
  async breakingTheBoundary(e: AEvent) {
    levelUp(e, 7, 2, 80)
    this.buttons(e)
    return
  }

  /**
   * 頓悟
   * @param e
   * @returns
   */
  async insight(e: AEvent) {
    levelUp(e, 19, 3, 80)
    this.buttons(e)
    return
  }
}
