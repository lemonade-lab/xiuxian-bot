import {
  isUser,
  isSideUser,
  dualVerification,
  dualVerificationAction,
  victoryCooling
} from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { user, user_level } from 'xiuxian-db'
import { operationLock } from 'xiuxian-core'
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

    const text = useParse(e.Megs, 'Text')

    const UIDB = e?.at_user?.id || text.replace(/^(#|\/)?(雙修|双修)/, '')
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

    const CDID = 14
    const CDTime = GameApi.Cooling.CD_transmissionPower
    if (!(await victoryCooling(e, UID, CDID))) return

    GameApi.Burial.set(UID, CDID, CDTime)

    // 读取境界
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
    const sizeA = LevelDataA.experience * 0.15
    const sizeB = LevelDataB.experience * 0.1
    const expA = sizeA > 648 ? 648 : sizeA
    const expB = sizeB > 648 ? 648 : sizeB

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

    const exA = Math.floor((expA * (UserData.talent_size + 100)) / 100),
      exB = Math.floor((expB * (UserDataB.talent_size + 100)) / 100)
    const eA = exA < 3280 ? exA : 3280,
      eB = exB < 3280 ? exB : 3280

    await GameApi.Levels.addExperience(UID, 1, eA)
    await GameApi.Levels.addExperience(UIDB, 1, eB)

    Send(
      Text(
        [
          '❤️',

          '情投意合~\n',

          `你激动的修为增加了${eA}~\n`,

          `对方奇怪的修为增加了${eB}`
        ].join('')
      )
    )

    return
  },
  'message.create',
  /^(#|\/)?(雙修|双修).*$/
)
