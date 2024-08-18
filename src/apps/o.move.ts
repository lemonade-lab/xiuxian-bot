import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'

export default new Messages().response(
  /^(#|\/)?(坐标信息|坐標信息)$/,
  async e => {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    e.reply([`坐标(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`])
    return
  }
)
