import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import { user } from 'xiuxian-db'

export default new Messages().response(
  /^(#|\/)?(坐标信息|坐標信息)$/,
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
    e.reply([`坐标(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`])
    return
  }
)
