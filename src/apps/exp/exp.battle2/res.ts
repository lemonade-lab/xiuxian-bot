import { isUser } from 'xiuxian-api'
import { user } from 'xiuxian-db'
export default OnResponse(
  async e => {
    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    if (new RegExp(/战斗过程开启/).test(e.msg)) {
      UserData.battle_show = 1
    } else {
      UserData.battle_show = 0
    }

    await user.update(
      {
        battle_show: UserData.battle_show
      },
      {
        where: {
          uid: UID
        }
      }
    )

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
  },
  'message.create',
  /^(#|\/)?战斗过程(开启|关闭)$/
)
