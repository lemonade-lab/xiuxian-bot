import { controlByName, sendReply, isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
export default OnResponse(
  async e => {
    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    if (!(await controlByName(e, UserData, '联盟'))) return
    const start_msg = []
    start_msg.push('\n[/兑换+物品名*数量]')

    const text = useParse(e.Megs, 'Text')

    const type = text.replace(/^(#|\/)?(联盟商会|聯盟商會)/, '')
    const commoditiesList = await DB.goods
      .findAll({
        where: {
          alliancemall: 1,
          type: GameApi.Goods.mapType[type] ?? GameApi.Goods.mapType['道具']
        }
      })
      .then(res => res.map(item => item.dataValues))
    const end_msg = GameApi.Goods.getListMsg(commoditiesList, '声望')
    const msg = [...start_msg, ...end_msg]
    sendReply(e, '___[联盟商会]___', msg)
    return
  },
  'message.create',
  /^(#|\/)?(联盟商会|聯盟商會)(武器|护具|法宝|丹药|功法|道具|材料|装备)?$/
)
