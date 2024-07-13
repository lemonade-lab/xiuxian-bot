import { APlugin, type AEvent } from 'alemonjs'
import { GameApi, ControlByBlood, isThereAUserPresent } from 'xiuxian-api'

import * as DB from 'xiuxian-db'

export class Move extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(坐标信息|坐標信息)$/, fnc: 'xyzaddress' },
        { reg: /^(#|\/)?向上$/, fnc: 'mapW' },
        { reg: /^(#|\/)?向左$/, fnc: 'mapA' },
        { reg: /^(#|\/)?向下$/, fnc: 'mapS' },
        { reg: /^(#|\/)?向右$/, fnc: 'mapD' }
      ]
    })
  }

  async xyzaddress(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    e.reply([`坐标(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`])
    return
  }

  async mapW(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await ControlByBlood(e, UserData))) return
    UserData.pont_y += 10
    showAction(e, UID, UserData)
    return
  }

  async mapA(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await ControlByBlood(e, UserData))) return
    UserData.pont_x -= 10
    showAction(e, UID, UserData)
    return
  }

  async mapS(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await ControlByBlood(e, UserData))) return
    UserData.pont_y -= 10
    showAction(e, UID, UserData)
    return
  }

  async mapD(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await ControlByBlood(e, UserData))) return
    UserData.pont_x += 10
    showAction(e, UID, UserData)
    return
  }
}

async function showAction(e: AEvent, UID: string, UserData: DB.UserType) {
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
    } as DB.UserType)
    e.reply(`(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`)
  }
  return
}
