import { isThereAUserPresent } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { Messages } from 'alemonjs'
export default new Messages().response(/^(#|\/)?扩建宝库$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
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
  if (v === '权能不足') {
    e.reply(v)
    return
  }
  if (UIDData['ass.bag_grade'] > 4) {
    e.reply('宗门宝库等级已达最高')
    return
  }

  const goods = await GameApi.Bag.searchBagByName(UID, '开天令')
  const num = GameApi.Cooling.upgradeass[UIDData['ass.bag_grade']]
  if (!goods) {
    e.reply('你没有开天令')
    return
  }
  if (goods.acount < num) {
    e.reply('开天令不足')
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
      e.reply('升级完成', {
        quote: e.msg_id
      })
    })
    .catch(() => {
      e.reply('升级失败', {
        quote: e.msg_id
      })
    })
  return
})
