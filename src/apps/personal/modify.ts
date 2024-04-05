import { APlugin, type AEvent } from 'alemonjs'
import {
  DB,
  GameApi,
  Control,
  showUserMsg,
  victoryCooling,
  isThereAUserPresent
} from '../../api/index.js'
export class Modify extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?(更改道号|更改道號)[\u4e00-\u9fa5]+$/,
          fnc: 'changeName'
        },
        { reg: /^(#|\/)?更改道宣[\u4e00-\u9fa5]+$/, fnc: 'changeAutograph' }
      ]
    })
  }

  /**
   * 更改道号
   * @param e
   * @returns
   */
  async changeName(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await Control(e, UserData))) return
    const name = e.msg.replace(/^(#|\/)?(更改道号|更改道號)/, '')
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
   *更改道宣
   * @param e
   * @returns
   */
  async changeAutograph(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await Control(e, UserData))) return
    const autograph = e.msg.replace(/^(#|\/)?更改道宣/, '')
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
