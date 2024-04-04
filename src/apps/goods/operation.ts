import { plugin, type AEvent } from 'alemonjs'
import {
  GameApi,
  dualVerification,
  dualVerificationAction,
  victoryCooling,
  isThereAUserPresent,
  isThereAUserPresentB
} from '../../api/index.js'
export class MoneyOperation extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(赠送|贈送)[\u4e00-\u9fa5]+\*\d+$/, fnc: 'giveMoney' }
      ]
    })
  }

  async giveMoney(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    const UIDB = e?.at_user?.id
    if (!UIDB) return
    if (!(await isThereAUserPresentB(e, UIDB))) return
    const UserDataB = await GameApi.Users.read(UIDB)
    if (!(await dualVerification(e, UserData, UserDataB))) return
    if (!dualVerificationAction(e, UserData.point_type, UserDataB.point_type))
      return
    const [name, acount] = e.msg.replace(/^(#|\/)?(赠送|贈送)/, '').split('*')
    const thing = await GameApi.Bag.searchBagByName(UID, name)
    if (thing && thing.type == 8) return e.reply('无法赠送')
    if (!thing || thing.acount < Number(acount)) {
      e.reply([`似乎没有[${name}]*${acount}`], {
        quote: e.msg_id
      })
      return
    }
    // 判断储物袋大小,不够的就不推送
    const BagSize = await GameApi.Bag.backpackFull(UIDB, UserDataB.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    const CDID = 5,
      CDTime = GameApi.Cooling.CD_Transfer

    if (!(await victoryCooling(e, UID, CDID))) return

    GameApi.Burial.set(UID, CDID, CDTime)
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: name,
        acount: Number(acount)
      }
    ])
    await GameApi.Bag.addBagThing(UIDB, UserDataB.bag_grade, [
      {
        name,
        acount: Number(acount)
      }
    ])
    e.reply(['你赠送了', `[${name}]*${acount}`], {
      quote: e.msg_id
    })
    return
  }
}
