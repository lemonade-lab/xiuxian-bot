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
  /^(#|\/)?签名[\u4e00-\u9fa5]+$/,
  async e => {
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
    })
    setTimeout(() => {
      showUserMsg(e)
    }, 500)
    return
  }
)
