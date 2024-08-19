import { Messages } from 'alemonjs'
import { ControlByBlood, isThereAUserPresent, showAction } from 'xiuxian-api'

import { user } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?向左$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)
  if (!(await ControlByBlood(e, UserData))) return
  UserData.pont_x -= 10
  showAction(e, UID, UserData)
  return
})
