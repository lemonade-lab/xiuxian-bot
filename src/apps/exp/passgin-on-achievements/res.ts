import {
  isUser,
  isSideUser,
  dualVerification,
  dualVerificationAction
} from '@xiuxian/api/index'
import * as GameApi from '@xiuxian/core/index'
import { user, user_level } from '@xiuxian/db/index'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    // lock start
    const T = await GameApi.operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }

    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const ats = useParse(e.Megs, 'At')
    let UIDB = null
    if (!ats || ats.length === 0) {
      const text = useParse(e.Megs, 'Text')
      UIDB = text.replace(/^(#|\/)?(传功|傳功)/, '')
    } else {
      const d = ats.find(item => item?.typing === 'user' && !item.bot)
      UIDB = d?.value
    }

    if (!UIDB) return

    const UserDataB = await isSideUser(e, UIDB)

    if (typeof UserDataB === 'boolean') return

    if (!(await dualVerification(e, UserData, UserDataB))) return

    if (UserData.special_spiritual < 5) {
      Send(Text('灵力不足'))
      return
    }

    if (UserDataB.special_spiritual < 5) {
      Send(Text('对方灵力不足'))

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
      Send(Text('未到元婴期'))

      return
    }
    if (LevelDataA.experience <= 2000) {
      Send(Text('所剩修为低于2000'))

      return
    }
    // B的境界相差
    const LevelSize = 9
    if (
      LevelDataB.realm < LevelDataA.realm - LevelSize ||
      LevelDataB.realm > LevelDataA.realm + LevelSize
    ) {
      Send(Text('最多可相差9个境界'))

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
      Send(Text('传功失败了,掉落了一个境界！'))
      return
    }

    // 清空经验
    await GameApi.Levels.reduceExperience(UID, 1, LevelDataA.experience)

    // 增加对方经验
    const size = Math.floor(LevelDataA.experience * 0.6)
    await GameApi.Levels.addExperience(UIDB, 1, size)
    Send(Text(`成功传${size}修为给${UIDB}`))

    return
  },
  'message.create',
  /^(#|\/)?(传功|傳功).*$/
)
