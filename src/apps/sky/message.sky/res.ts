import { isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import { skys, user_skys } from 'xiuxian-db'
import { Op } from 'sequelize'
import { Bag } from 'xiuxian-core'
export default OnResponse(
  async e => {
    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    // 查看数据是否存在
    const data = await DB.sky
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)
    if (!data) {
      e.reply('未已进入', {
        quote: e.msg_id
      })
      return
    }
    if (data.id > 50) {
      e.reply('最低奖励需排名50')
      return
    }
    // 国际时间
    const currentDate = new Date()
    currentDate.setDate(1)
    currentDate.setHours(0, 0, 0, 0)
    // 北京时间
    // const currentDate = new Date()
    // currentDate.setDate(1)
    // currentDate.setHours(8, 0, 0, 0)
    const uDAta = await user_skys
      .findAll({
        where: {
          uid: UID,
          time: currentDate
        }
      })
      .then(res => res.map(item => item.dataValues))

    // 领取记录
    const ids = uDAta.map(item => item.sid)
    // 找到 比 比排名少的数据。 并一次检查记录中，是否存在领取记录。
    const sData = await skys
      .findAll({
        where: {
          ranking: {
            [Op.gte]: data.id
          }
        }
      })
      .then(res => res.map(item => item.dataValues))
    const sData2 = sData.filter(item => {
      // 存在
      if (ids.includes(item.id)) {
        return false
      } else {
        return true
      }
    })
    const goods = sData2.map(item => ({
      id: item.id,
      name: item.name,
      acount: item.count
    }))

    const BagSize = await Bag.backpackFull(UID)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    const msg = ['领取物品']
    for (const item of goods) {
      await user_skys.create({
        uid: UID,
        // 对应奖励条
        time: currentDate,
        sid: item.id,
        createAt: new Date()
      })
      msg.push(`[${item.name}]*${item.acount}`)
    }
    await Bag.addBagThing(UID, goods)
    if (msg.length <= 1) {
      e.reply('此排名奖励本月已无法领取')
    } else {
      e.reply(msg.join('\n'))
    }
  },
  'message.create',
  /^(#|\/)?通天塔奖励$/
)
