import { isUser, endAllWord } from 'xiuxian-api'
export default OnResponse(
  async e => {
    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    endAllWord(e, UID, UserData)
    return
  },
  'message.create',
  /^(#|\/)?(归来|歸來|凝脉|出关|出關|聚灵|聚靈)$/
)
