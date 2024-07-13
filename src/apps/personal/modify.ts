import { APlugin, type AEvent } from 'alemonjs'
import {
  GameApi,
  Control,
  showUserMsg,
  victoryCooling,
  isThereAUserPresent
} from '../../api/index.js'

import * as DB from 'xiuxian-db'

import { Config } from 'xiuxian-core'

export class Modify extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?(改名|更改道號)[\u4e00-\u9fa5]+$/,
          fnc: 'changeName'
        },
        { reg: /^(#|\/)?签名[\u4e00-\u9fa5]+$/, fnc: 'changeAutograph' }
      ]
    })
  }

  /**
   * 改名
   * @param e
   * @returns
   */
  async changeName(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await Control(e, UserData))) return
    const name = e.msg.replace(/^(#|\/)?(改名|更改道號)/, '')
    if (Config.IllegalCharacters.test(name)) {
      e.reply(['异常名称'], {
        quote: e.msg_id
      })
      return
    }
    if (name.length == 0) return
    if (name.length > 8) {
      e.reply(['你这名字\n可真是稀奇'], {
        quote: e.msg_id
      })

      return
    }
    const CDID = 3,
      CDTime = GameApi.Cooling.CD_Name
    4
    if (!(await victoryCooling(e, UID, CDID))) return

    GameApi.Burial.set(UID, CDID, CDTime)
    // 更新用户
    await GameApi.Users.update(UID, {
      name: name
    } as DB.UserType)
    setTimeout(() => {
      showUserMsg(e)
    }, 500)
    return
  }

  /**
   *签名
   * @param e
   * @returns
   */
  async changeAutograph(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await Control(e, UserData))) return
    const autograph = e.msg.replace(/^(#|\/)?签名/, '')
    if (Config.IllegalCharacters.test(autograph)) {
      e.reply(['异常签名'], {
        quote: e.msg_id
      })
      return
    }
    if (autograph.length == 0 || autograph.length > 50) {
      e.reply(['请正确设置\n且道宣最多50字符'], {
        quote: e.msg_id
      })
      return
    }
    const CDID = 4,
      CDTime = GameApi.Cooling.CD_Autograph

    if (!(await victoryCooling(e, UID, CDID))) return

    GameApi.Burial.set(UID, CDID, CDTime)
    // 更新用户
    await GameApi.Users.update(UID, {
      autograph: autograph
    } as DB.UserType)
    setTimeout(() => {
      showUserMsg(e)
    }, 500)
    return
  }
}
