import { Messages } from 'alemonjs'
import { ControlByBlood, isUser, showAction } from 'xiuxian-api'

import { user } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?向左$/, async e => {
  const UID = e.user_id

  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return

  if (!(await ControlByBlood(e, UserData))) return
  UserData.pont_x -= 10
  showAction(e, UID, UserData)
  return
})
