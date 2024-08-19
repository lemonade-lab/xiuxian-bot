import { Messages } from 'alemonjs'
import { isThereAUserPresent, endAllWord } from 'xiuxian-api'
import { user } from 'xiuxian-db'
export default new Messages().response(
  /^(#|\/)?(归来|歸來|凝脉|出关|出關|聚灵|聚靈)$/,
  async e => {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await user
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res.dataValues)
    endAllWord(e, UID, UserData)
    return
  }
)
