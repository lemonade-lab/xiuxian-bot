import { Messages } from 'alemonjs'
import { isThereAUserPresent, sendReply } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?位置信息$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  const PositionData = await DB.map_point
    .findAll({})
    .then(res => res.map(item => item.dataValues))
  const msg: string[] = []
  for await (const item of PositionData) {
    if (
      item?.z == UserData.pont_z &&
      item?.attribute == UserData.pont_attribute &&
      item?.type == UserData.point_type
    ) {
      msg.push(`\n地点名:${item?.name}\n坐标(${item?.x},${item?.y},${item?.z})`)
    }
  }
  sendReply(e, '[位置信息]', msg)
  return
})
