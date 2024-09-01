import { Messages } from 'alemonjs'
import { Control, showUserMsg, victoryCooling, isUser } from 'xiuxian-api'
import { Config } from 'xiuxian-core'
import * as GameApi from 'xiuxian-core'
import { user } from 'xiuxian-db'
export default new Messages().response(
  /^(#|\/)?(改名|更改道號)[\u4e00-\u9fa5]+$/,
  async e => {
    const UID = e.user_id

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

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
    const CDID = 3
    const CDTime = GameApi.Cooling.CD_Name
    if (!(await victoryCooling(e, UID, CDID))) return
    GameApi.Burial.set(UID, CDID, CDTime)
    //
    await user.update(
      {
        name: name
      },
      {
        where: {
          uid: UID
        }
      }
    )
    setTimeout(() => {
      showUserMsg(e)
    }, 500)
    return
  }
)
