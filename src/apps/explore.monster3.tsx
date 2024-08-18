import { Messages } from 'alemonjs'
import {
  isThereAUserPresent,
  ControlByBlood,
  sendReply,
  controlByName
} from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
const reStart = {}
export default new Messages().response(/^(#|\/)?挑战妖塔$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  if (!reStart[UID] || reStart[UID] + 120000 < new Date().getTime()) {
    reStart[UID] = new Date().getTime()
    e.reply([`CD中`]).catch((err: any) => {
      console.error(err)
      return
    })
    return
  }
  if (!(await controlByName(e, UserData, '星海'))) return
  if (!(await ControlByBlood(e, UserData))) return
  // 判断储物袋大小,不够的就不推送
  const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
  // 背包未位置了直接返回了
  if (!BagSize) {
    e.reply(['储物袋空间不足'], {
      quote: e.msg_id
    })
    return
  }
  const bag = await GameApi.Bag.searchBagByName(UID, '下品灵石')
  if (!bag || bag.acount < 100000) {
    e.reply('下品灵石不足')
    return
  }
  GameApi.Bag.reduceBagThing(UID, [{ name: '下品灵石', acount: 100000 }])
  const p = Math.floor(Math.random() * (100 - 1) + 1)
  let addpower = 0
  if (p < 25) {
    addpower = 0
  } else if (p > 25 && p < 50) {
    addpower = 1 + 0.25
  } else if (p > 50 && p < 75) {
    addpower = 1 + 0.3
  } else if (p > 75 && p <= 100) {
    addpower = 1 + 0.4
  }
  const BMSG = GameApi.Fight.start(UserData, {
    uid: '1',
    name: '守塔人',
    battle_show: 0,
    battle_blood_now: Math.floor(366791 + addpower),
    battle_attack: Math.floor(52114 + addpower),
    battle_defense: Math.floor(25525 + addpower),
    battle_blood_limit: Math.floor(366791 + addpower),
    battle_critical_hit: 10 + 30,
    battle_critical_damage: Math.floor(50 + addpower),
    battle_speed: Math.floor(41 + addpower),
    battle_power: 0
  })
  const BooldMsg = `\n🩸${BMSG.battle_blood_now.a}`
  if (UserData.battle_show) {
    sendReply(e, '[战斗结果]', BMSG.msg)
  }
  if (BMSG.victory == '0') {
    e.reply([`与${'守塔人'}打成了平手${BooldMsg}`], {
      quote: e.msg_id
    })
    return
  } else if (BMSG.victory == '1') {
    e.reply('你被守塔人击败了,未获得任何物品')
  } else {
    if (p < 25) {
      if (p < 5) {
        GameApi.Bag.addBagThing(UID, 6, [{ name: '养魂木', acount: 1 }])
        e.reply('获得养魂木*1')
        return
      } else if (p < 10) {
        GameApi.Bag.addBagThing(UID, 6, [{ name: '金焰石', acount: 1 }])
        e.reply('获得金焰石*1')
        return
      } else if (p < 15) {
        GameApi.Bag.addBagThing(UID, 6, [{ name: '息壤之土', acount: 1 }])
        e.reply('获得息壤之土*1')
        return
      } else if (p < 20) {
        GameApi.Bag.addBagThing(UID, 6, [{ name: '灵烛果', acount: 1 }])
        e.reply('获得灵烛果*1')
        return
      } else {
        GameApi.Bag.addBagThing(UID, 6, [{ name: '长生泉', acount: 1 }])
        e.reply('获得长生泉*1')
        return
      }
    } else if (p > 25 && p < 50) {
      e.reply('虽然你勇敢地战胜了守塔的守卫,但这次战斗似乎没有找到任何物品')
      return
    } else if (p > 50 && p <= 100) {
      GameApi.Bag.addBagThing(UID, 6, [{ name: '还春丹', acount: 2 }])
      e.reply('获得还春丹*2')
      return
    }
  }
  return
})
