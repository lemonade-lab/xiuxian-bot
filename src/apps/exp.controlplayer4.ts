import { Messages } from 'alemonjs'
import { isThereAUserPresent, endAllWord } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?(归来|歸來|凝脉|出关|出關|聚灵|聚靈)$/,
  async e => {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    endAllWord(e, UID, UserData)
    return
  }
)
