import { Messages } from 'alemonjs'
import {
  isThereAUserPresent,
  isThereAUserPresentB,
  dualVerification,
  dualVerificationAction,
  victoryCooling
} from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { Redis } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?(雙修|双修).*$/, async e => {
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
  const UIDB = e?.at_user?.id || e.msg.replace(/^(#|\/)?(雙修|双修)/, '')
  if (!UIDB) return
  if (!(await isThereAUserPresentB(e, UIDB))) return
  const UserDataB = await GameApi.Users.read(UIDB)
  if (!(await dualVerification(e, UserData, UserDataB))) return
  if (UserData.special_spiritual < 5) {
    e.reply(['灵力不足'], {
      quote: e.msg_id
    })
    return
  }
  if (UserDataB.special_spiritual < 5) {
    e.reply(['灵力不足'], {
      quote: e.msg_id
    })
    return
  }
  if (!dualVerificationAction(e, UserData.point_type, UserDataB.point_type))
    return

  const CDID = 14
  const CDTime = GameApi.Cooling.CD_transmissionPower
  if (!(await victoryCooling(e, UID, CDID))) return

  GameApi.Burial.set(UID, CDID, CDTime)

  // 读取境界
  const LevelDataA = await GameApi.Levels.read(UID, 1),
    LevelDataB = await GameApi.Levels.read(UIDB, 1)
  const sizeA = LevelDataA.experience * 0.15,
    sizeB = LevelDataB.experience * 0.1
  const expA = sizeA > 648 ? 648 : sizeA,
    expB = sizeB > 648 ? 648 : sizeB

  await GameApi.Users.update(UID, {
    special_spiritual: UserData.special_spiritual - 5
  })
  await GameApi.Users.update(UIDB, {
    special_spiritual: UserDataB.special_spiritual - 5
  })

  const exA = Math.floor((expA * (UserData.talent_size + 100)) / 100),
    exB = Math.floor((expB * (UserDataB.talent_size + 100)) / 100)
  const eA = exA < 3280 ? exA : 3280,
    eB = exB < 3280 ? exB : 3280

  await GameApi.Levels.addExperience(UID, 1, eA)
  await GameApi.Levels.addExperience(UIDB, 1, eB)

  e.reply(
    [
      '❤️',

      '情投意合~\n',

      `你激动的修为增加了${eA}~\n`,

      `对方奇怪的修为增加了${eB}`
    ],
    {
      quote: e.msg_id
    }
  )
  return
})
