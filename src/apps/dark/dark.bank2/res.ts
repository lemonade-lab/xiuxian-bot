import { isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
export default OnResponse(
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const T = await operationLock(e.UserId)
    if (!T) {
      e.reply('操作频繁')
      return
    }
    /**
     * lock end
     */

    const UID = e.UserId
    let msg = []

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const text = useParse(e.Megs, 'Text')

    let account = Number(text.replace(/^(#|\/)?治炼仙石/, '')) || 1
    if (account > 10) account = 10
    const Userleve = await DB.user_level
      .findOne({
        where: { uid: UID, type: 1 }
      })
      .then(res => res?.dataValues)
    if (Userleve.realm < 42) {
      e.reply('境界不足')
      return
    }
    let lingshi = await GameApi.Bag.searchBagByName(UID, '极品灵石')
    if (!lingshi || lingshi.acount < Number(account) * 10000) {
      e.reply(`请确保您有足够的极品灵石再试一次呢~`)
      return
    }

    const BagSize = await GameApi.Bag.backpackFull(UID)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    for (let i = 0; i < Number(account); i++) {
      const P1 = GameApi.Method.isProbability(60)
      if (P1) {
        msg.push('炼制成功获得仙石*1\n')
        await GameApi.Bag.addBagThing(UID, [
          {
            name: '仙石',
            acount: 1
          }
        ])
      } else {
        msg.push('炼制失败\n')
      }
      await GameApi.Bag.reduceBagThing(UID, [
        {
          name: '极品灵石',
          acount: 10000
        }
      ])
    }
    e.reply(msg)
  },
  'message.create',
  /^(#|\/)?治炼仙石\d+$/
)
