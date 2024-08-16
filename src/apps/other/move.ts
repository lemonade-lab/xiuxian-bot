import { Messages, type AEvent } from 'alemonjs'
import { ControlByBlood, isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'

async function showAction(e: AEvent, UID: string, UserData) {
  const mData = await GameApi.Map.getRecordsByXYZ(
    UserData.pont_x,
    UserData.pont_y,
    UserData.pont_z
  )
  if (mData) {
    await GameApi.Users.update(UID, {
      point_type: mData.type,
      pont_attribute: mData.attribute,
      pont_x: UserData.pont_x,
      pont_y: UserData.pont_y,
      pont_z: UserData.pont_z
    })
    e.reply(`(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`)
  }
  return
}

const message = new Messages()

message.response(/^(#|\/)?(坐标信息|坐標信息)$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  e.reply([`坐标(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`])
  return
})

message.response(/^(#|\/)?向上$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  if (!(await ControlByBlood(e, UserData))) return
  UserData.pont_y += 10
  showAction(e, UID, UserData)
  return
})

message.response(/^(#|\/)?向左$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  if (!(await ControlByBlood(e, UserData))) return
  UserData.pont_x -= 10
  showAction(e, UID, UserData)
  return
})

message.response(/^(#|\/)?向下$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  if (!(await ControlByBlood(e, UserData))) return
  UserData.pont_y -= 10
  showAction(e, UID, UserData)
  return
})

message.response(/^(#|\/)?向右$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  if (!(await ControlByBlood(e, UserData))) return
  UserData.pont_x += 10
  showAction(e, UID, UserData)
  return
})

export const Move = message.ok
