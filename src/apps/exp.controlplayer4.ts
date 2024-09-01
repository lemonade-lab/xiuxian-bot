import { Messages } from 'alemonjs'
import { isUser, endAllWord } from 'xiuxian-api'
export default new Messages().response(
  /^(#|\/)?(归来|歸來|凝脉|出关|出關|聚灵|聚靈)$/,
  async e => {
    const UID = e.user_id

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    endAllWord(e, UID, UserData)
    return
  }
)
