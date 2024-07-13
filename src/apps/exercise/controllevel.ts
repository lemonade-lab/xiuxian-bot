import { APlugin, type AEvent } from 'alemonjs'
import {
  isThereAUserPresent,
  isThereAUserPresentB,
  GameApi,
  dualVerification,
  dualVerificationAction,
  victoryCooling
} from '../../api/index.js'

import * as DB from 'xiuxian-db'

export class ControllLevel extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(传功|傳功).*$/, fnc: 'transmissionPower' },
        { reg: /^(#|\/)?(雙修|双修).*$/, fnc: 'ambiguous' }
      ]
    })
  }

  /**
   * 双修
   * @param e
   * @returns
   */
  async ambiguous(e: AEvent) {
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

    const CDID = 20,
      CDTime = GameApi.Cooling.CD_transmissionPower
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
    } as DB.UserType)
    await GameApi.Users.update(UIDB, {
      special_spiritual: UserDataB.special_spiritual - 5
    } as DB.UserType)

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
  }

  /**
   * 传功
   * @param e
   * @returns
   */
  async transmissionPower(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    const UIDB = e?.at_user?.id || e.msg.replace(/^(#|\/)?(传功|傳功)/, '')
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
    const LevelDataA = await GameApi.Levels.read(UID, 1),
      LevelDataB = await GameApi.Levels.read(UIDB, 1)
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

    await GameApi.Users.update(UID, {
      special_spiritual: UserData.special_spiritual - 5
    } as DB.UserType)
    await GameApi.Users.update(UIDB, {
      special_spiritual: UserDataB.special_spiritual - 5
    } as DB.UserType)

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
  }
}
