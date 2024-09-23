import { isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const UIDData = await DB.user_ass
      .findOne({
        where: {
          uid: UID
        },
        include: [
          {
            model: DB.ass
          }
        ]
      })
      .then(res => res?.dataValues)
    const v = await GameApi.Ass.v(UID, UIDData['ass.name'])
    if (v === false) return
    const Send = useSend(e)
    if (v === '权能不足') {
      Send(Text(v))
      return
    }
    if (UIDData['ass.bag_grade'] > 4) {
      Send(Text('宗门宝库等级已达最高'))
      return
    }
    const goods = await GameApi.Bag.searchBagByName(UID, '开天令')
    const num = GameApi.Cooling.upgradeass[UIDData['ass.bag_grade']]
    if (!goods) {
      Send(Text('你没有开天令'))
      return
    }
    if (goods.acount < num) {
      Send(Text('开天令不足'))
      return
    }
    GameApi.Bag.reduceBagThing(UID, [{ name: '开天令', acount: num }])
    await DB.ass
      .update(
        {
          bag_grade: UIDData['ass.bag_grade'] + 1
        },
        {
          where: {
            id: UIDData.aid
          }
        }
      )
      .then(() => {
        Send(Text('升级完成'))
      })
      .catch(err => {
        console.error(err)
        Send(Text('升级失败'))
      })
    return
  },
  'message.create',
  /^(#|\/)?扩建宝库$/
)
