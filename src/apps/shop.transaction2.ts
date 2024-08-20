import { Messages } from 'alemonjs'
import { controlByName, isThereAUserPresent } from 'xiuxian-api'
import { Method } from 'xiuxian-core'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?(购买|購買)[\u4e00-\u9fa5]+\*\d+$/,
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const KEY = `xiuxian:open:${e.user_id}`
    const LOCK = await DB.Redis.get(KEY)
    if (LOCK) {
      e.reply('操作频繁')
      return
    }
    await DB.Redis.set(KEY, 1, 'EX', 6)
    /**
     * lock end
     */

    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await DB.user
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res.dataValues)
    if (!(await controlByName(e, UserData, '万宝楼'))) return
    const [thingName, quantity] = e.msg
      .replace(/^(#|\/)?(购买|購買)/, '')
      .split('*')
    const ifexist = await DB.goods
      .findOne({
        where: {
          commodities: 1, // 找到万宝楼可购买的物品
          name: thingName // 找到物品名
        }
      })
      .then(res => res?.dataValues)
    if (!ifexist) {
      e.reply(`[万宝楼]小二:\n不卖[${thingName}]`)
      return
    }
    const lingshi = await GameApi.Bag.searchBagByName(UID, '下品灵石')
    const count = Math.floor(Number(quantity))

    const price = Math.floor(
      ifexist.price * count * GameApi.Cooling.ExchangeStart
    )
    if (!lingshi || lingshi.acount < price) {
      e.reply([`似乎没有${price}*[下品灵石]`], {
        quote: e.msg_id
      })
      return
    }
    // 检查背包
    const BagSize = await GameApi.Bag.backpackFull(UID)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }

    // 查看自己可买多少
    const bData = await DB.user_buy_log
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)
    const now = new Date()

    // 听说每天购买有bug
    // tudo
    if (count > ifexist.limit_buy) {
      e.reply(`[万宝楼]小二:\n每天可买${ifexist.limit_buy}`)
      return
    }

    if (bData) {
      // 存在  判断日期
      if (
        Method.isSameDay(bData.buy_time, now) &&
        bData.count > ifexist.limit_buy
      ) {
        e.reply(`[万宝楼]小二:\n每天可买${ifexist.limit_buy - bData.count}`)
        return
      } else {
        // 更新数据
        await DB.user_buy_log.update(
          {
            count: bData.count + count,
            buy_time: now,
            createAt: now
          },
          {
            where: {
              uid: UID,
              name: thingName
            }
          }
        )
      }
    } else {
      // 不存在，创建即可
      await DB.user_buy_log.create({
        uid: UID,
        name: thingName,
        count: count,
        buy_time: now,
        createAt: now
      })
    }

    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: price
      }
    ])

    await GameApi.Bag.addBagThing(UID, [
      {
        name: ifexist.name,
        acount: count
      }
    ])

    e.reply(
      `[万宝楼]薛仁贵\n你花[下品灵石]*${price}购买了[${thingName}]*${count},`
    )

    return
  }
)
