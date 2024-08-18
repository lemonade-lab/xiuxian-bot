import { Messages } from 'alemonjs'
import {
  Control,
  showUserMsg,
  victoryCooling,
  isThereAUserPresent
} from 'xiuxian-api'
import { Config } from 'xiuxian-core'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?(改名|更改道號)[\u4e00-\u9fa5]+$/,
  async e => {
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
    })
    setTimeout(() => {
      showUserMsg(e)
    }, 500)
    return
  }
)
