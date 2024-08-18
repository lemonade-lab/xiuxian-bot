import { Messages } from 'alemonjs'
import { isThereAUserPresent, controlByName } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { Redis } from 'xiuxian-db'

const stones = ['下品灵石', '中品灵石', '上品灵石', '极品灵石']

/**
 *
 * @param quantity
 * @param sourceStone
 * @param targetStone
 * @returns
 */
function convertStoneQuantity(
  quantity: number,
  sourceStone: string,
  targetStone: string
) {
  const sourceIndex = stones.indexOf(sourceStone),
    targetIndex = stones.indexOf(targetStone)
  const size = Math.abs(targetIndex - sourceIndex)
  const onSize = 10 ** size
  if (sourceIndex === -1 || targetIndex === -1) {
    // 如果输入的灵石名称不合法，则返回 null
    return false
  } else if (sourceIndex < targetIndex) {
    // 将左边的灵石转换为右边的灵石
    return Math.floor((quantity / onSize) * 0.9)
  } else if (sourceIndex > targetIndex) {
    // 将右边的灵石转换为左边的灵石
    return quantity * onSize
  } else {
    // 如果左右灵石相同，则直接返回原始数量
    return quantity
  }
}

export default new Messages().response(
  /^(#|\/)?(金银置换|金銀置換)\d+\*[\u4e00-\u9fa5]+\*[\u4e00-\u9fa5]+$/,
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const KEY = `xiuxian:open:${e.user_id}`
    const LOCK = await Redis.get(KEY)
    if (LOCK) {
      e.reply('操作频繁')
      return
    }
    await Redis.set(KEY, 1, 'EX', 6)
    /**
     * lock end
     */

    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '金银坊'))) return
    const [account, LeftName, RightName] = e.msg
      .replace(/^(#|\/)?(金银置换|金銀置換)/, '')
      .split('*')
    const quantity = convertStoneQuantity(Number(account), LeftName, RightName)
    if (!quantity) {
      e.reply(`[金银坊]金老三\n?你玩我呢?`)
      return
    }
    const lingshi = await GameApi.Bag.searchBagByName(UID, LeftName)
    if (!lingshi || lingshi.acount < Number(account)) {
      e.reply(`[金银坊]金老三\n?哪儿来的穷鬼!`)
      return
    }
    //
    if (LeftName == '极品灵石' && Number(account) < 20) {
      e.reply(`[金银坊]金老三\n少于${20}不换`)

      return
    }
    if (LeftName == '上品灵石' && Number(account) < 100) {
      e.reply(`[金银坊]金老三\n少于${100}不换`)
      return
    }
    if (LeftName == '中品灵石' && Number(account) < 500) {
      e.reply(`[金银坊]金老三\n少于${500}不换`)
      return
    }
    if (LeftName == '下品灵石' && Number(account) < 2500) {
      e.reply(`[金银坊]金老三\n少于${2500}不换`)
      return
    }
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })

      return
    }
    // 先扣除
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: LeftName,
        acount: Number(account)
      }
    ])
    // 再增加
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: RightName,
        acount: quantity
      }
    ])

    e.reply([`[${LeftName}]*${account}\n置换成\n[${RightName}]*${quantity}`])
    return
  }
)
