import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { Redis } from 'xiuxian-db'
export default new Messages().response(
  /^(#|\/)?服用[\u4e00-\u9fa5]+\*\d+$/,
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
    const [thingName, thingAcount] = e.msg
      .replace(/^(#|\/)?服用/, '')
      .split('*')
    const thing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!thing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    if (thing.acount < Number(thingAcount)) {
      e.reply(['数量不足'], {
        quote: e.msg_id
      })
      return
    }
    // 得到用户数据
    const UserData = await GameApi.Users.read(UID)

    switch (thing.addition) {
      case 'boolere_covery': {
        let size = thing.boolere_covery * Number(thingAcount)
        size = size > 100 ? 100 : size
        const blood = await GameApi.Equipment.addBlood(UserData, size)
        e.reply([`💊${thingName}\n恢复了${size}%的血量\n🩸${blood}`], {
          quote: e.msg_id
        })
        break
      }
      case 'exp_gaspractice': {
        if (thing.exp_gaspractice <= 0) {
          e.reply([`[修为]+${0}`], {
            quote: e.msg_id
          })
          break
        }
        const size = Math.floor(
          (Number(thingAcount) *
            thing.exp_gaspractice *
            (UserData.talent_size + 100)) /
            100
        )
        const { msg } = await GameApi.Levels.addExperience(UID, 1, size)
        e.reply([msg], {
          quote: e.msg_id
        })
        break
      }
      case 'exp_bodypractice': {
        const size = Math.floor(
          (Number(thingAcount) *
            thing.exp_bodypractice *
            (UserData.talent_size + 100)) /
            100
        )
        const { msg } = await GameApi.Levels.addExperience(UID, 2, size)
        e.reply([msg], {
          quote: e.msg_id
        })
        break
      }
      case 'exp_soul': {
        const size = Math.floor(
          (Number(thingAcount) *
            thing.exp_soul *
            (UserData.talent_size + 100)) /
            100
        )
        const { msg } = await GameApi.Levels.addExperience(UID, 3, size)
        e.reply([msg], {
          quote: e.msg_id
        })
        break
      }
      default: {
        e.reply([`啥也不是的东东,丢了~`], {
          quote: e.msg_id
        })
      }
    }
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: thing.name,
        acount: Number(thingAcount)
      }
    ])
    return
  }
)
