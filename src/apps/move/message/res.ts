import { Text, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const Send = useSend(e)
    Send(Text(`坐标(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`))
    return
  },
  'message.create',
  /^(#|\/)?(坐标信息|坐標信息)$/
)
