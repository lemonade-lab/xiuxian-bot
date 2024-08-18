import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?战斗过程(开启|关闭)$/,
  async e => {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (new RegExp(/战斗过程开启/).test(e.msg)) {
      UserData.battle_show = 1
    } else {
      UserData.battle_show = 0
    }
    await GameApi.Users.update(UID, {
      battle_show: UserData.battle_show
    })
    if (UserData.battle_show == 1) {
      e.reply(['战斗过程开启'], {
        quote: e.msg_id
      })

      return
    } else {
      e.reply(['战斗过程关闭'], {
        quote: e.msg_id
      })

      return
    }
  }
)
