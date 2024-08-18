import { Messages } from 'alemonjs'
import { controlByName, sendReply, isThereAUserPresent } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?(万宝楼|萬寶樓)(武器|护具|法宝|丹药|功法|道具|材料|装备)?$/,
  async e => {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '万宝楼'))) return
    const start_msg = []
    start_msg.push('\n欢迎关顾本店')
    const type = e.msg.replace(/^(#|\/)?(万宝楼|萬寶樓)/, '')
    const commoditiesList = await DB.goods
      .findAll({
        where: {
          commodities: 1,
          type: GameApi.Goods.mapType[type] ?? GameApi.Goods.mapType['道具']
        }
      })
      .then(res => res.map(item => item.dataValues))
    const end_msg = GameApi.Goods.getListMsg(
      commoditiesList,
      '灵石',
      GameApi.Cooling.ExchangeStart
    )
    sendReply(e, '___[万宝楼]___', [...start_msg, ...end_msg])
    return
  }
)
