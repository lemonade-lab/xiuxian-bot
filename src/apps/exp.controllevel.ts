import { Messages } from 'alemonjs'
import {
  isThereAUserPresent,
  isThereAUserPresentB,
  dualVerification,
  dualVerificationAction
} from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { user, user_level } from 'xiuxian-db'
import { operationLock } from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?(传功|傳功).*$/, async e => {
  /**
   * *******
   * lock start
   * *******
   */
  const T = await operationLock(e.user_id)
  if (!T) {
    e.reply('操作频繁')
    return
  }
  /**
   * lock end
   */

  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)
  const UIDB = e?.at_user?.id || e.msg.replace(/^(#|\/)?(传功|傳功)/, '')
  if (!UIDB) return
  if (!(await isThereAUserPresentB(e, UIDB))) return
  const UserDataB = await user
    .findOne({
      where: {
        uid: UIDB
      }
    })
    .then(res => res.dataValues)
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
  const LevelDataA = await user_level
    .findOne({
      attributes: ['addition', 'realm', 'experience'],
      where: {
        uid: UID,
        type: 1
      }
    })
    .then(res => res?.dataValues)
  const LevelDataB = await user_level
    .findOne({
      attributes: ['addition', 'realm', 'experience'],
      where: {
        uid: UIDB,
        type: 1
      }
    })
    .then(res => res?.dataValues)
  if (!LevelDataA || !LevelDataB) return
  if (LevelDataA.realm < 21) {
    e.reply(['未到元婴期'], {
      quote: e.msg_id
    })

    return
  }
  if (LevelDataA.experience <= 2000) {
    e.reply(['所剩修为低于2000'], {
      quote: e.msg_id
    })
    return
  }
  // B的境界相差
  const LevelSize = 9
  if (
    LevelDataB.realm < LevelDataA.realm - LevelSize ||
    LevelDataB.realm > LevelDataA.realm + LevelSize
  ) {
    e.reply(['与', '最多可相差9个境界'], {
      quote: e.msg_id
    })
    return
  }

  await user.update(
    {
      special_spiritual: UserData.special_spiritual - 5
    },
    {
      where: {
        uid: UID
      }
    }
  )

  await user.update(
    {
      special_spiritual: UserDataB.special_spiritual - 5
    },
    {
      where: {
        uid: UIDB
      }
    }
  )

  if (!GameApi.Method.isTrueInRange(1, 100, 85)) {
    // 清空经验
    await GameApi.Levels.reduceExperience(UID, 1, LevelDataA.experience)
    // 掉境界
    await GameApi.Levels.fallingRealm(UID, 1)
    e.reply(['🤪传功失败了', '掉落了一个境界！'], {
      quote: e.msg_id
    })
    return
  }
  // 清空经验
  await GameApi.Levels.reduceExperience(UID, 1, LevelDataA.experience)
  // 增加对方经验
  const size = Math.floor(LevelDataA.experience * 0.6)
  await GameApi.Levels.addExperience(UIDB, 1, size)
  e.reply(['成功传', `[修为]*${size}给`, UIDB], {
    quote: e.msg_id
  })
  return
})
