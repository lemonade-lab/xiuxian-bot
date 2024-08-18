import { Messages } from 'alemonjs'
import { ControlByBlood, isThereAUserPresent, showAction } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?向下$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  if (!(await ControlByBlood(e, UserData))) return
  UserData.pont_y -= 10
  showAction(e, UID, UserData)
  return
})
