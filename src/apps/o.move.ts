import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { user } from 'xiuxian-db'

export default new Messages().response(
  /^(#|\/)?(坐标信息|坐標信息)$/,
  async e => {
    const UID = e.user_id

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    e.reply([`坐标(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`])
    return
  }
)
