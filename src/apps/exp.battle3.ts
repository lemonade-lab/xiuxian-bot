import { Messages } from 'alemonjs'
import {
  isThereAUserPresent,
  sendReply,
  dualVerification,
  dualVerificationAction,
  isThereAUserPresentB,
  victoryCooling
} from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?(比斗|比鬥)/, async e => {
  const UID = e.user_id
  console.log('UID', UID)
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  const UIDB = e?.at_user?.id || e.msg.replace(/^(#|\/)?(比斗|比鬥)/, '')
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
  const CDID = 14,
    CDTime = GameApi.Cooling.CD_Ambiguous
  if (!(await victoryCooling(e, UID, CDID))) return

  GameApi.Burial.set(UID, CDID, CDTime)

  const BMSG = GameApi.Fight.start(UserData, UserDataB)

  /**
   * 是否显示战斗结果
   */
  if (UserData.battle_show || UserDataB.battle_show) {
    sendReply(e, '[战斗结果]', BMSG.msg)
  }

  e.reply(
    [`你的🩸${BMSG.battle_blood_now.a}\n`, `对方🩸${BMSG.battle_blood_now.b}`],
    {
      quote: e.msg_id
    }
  )
  const LevelDataA = await GameApi.Levels.read(UID, 1),
    LevelDataB = await GameApi.Levels.read(UIDB, 1)

  const sizeA = LevelDataA.experience * 0.15,
    sizeB = LevelDataB.experience * 0.1 // 被动的
  const expA = sizeA > 648 ? 648 : sizeA,
    expB = sizeB > 648 ? 648 : sizeB

  await GameApi.Users.update(UID, {
    battle_blood_now: BMSG.battle_blood_now.a,
    special_spiritual: UserData.special_spiritual - 5
  })
  await GameApi.Users.update(UIDB, {
    battle_blood_now: BMSG.battle_blood_now.b,
    special_spiritual: UserDataB.special_spiritual - 5
  })

  const exA = Math.floor((expA * (UserDataB.talent_size + 100)) / 100),
    exB = Math.floor((expB * (UserDataB.talent_size + 100)) / 100)
  const eA = exA < 3280 ? exA : 3280,
    eB = exB < 3280 ? exB : 3280

  await GameApi.Levels.addExperience(UID, 2, eA)
  await GameApi.Levels.addExperience(UIDB, 2, eB)

  e.reply(
    [
      '🤺🤺',
      '经过一番畅快的比斗~\n',
      `你激昂的气血增加了${eA}~\n`,
      `对方坚毅的气血增加了${eB}`
    ],
    {
      quote: e.msg_id
    }
  )
  return
})
