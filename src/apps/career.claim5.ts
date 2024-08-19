import { Messages } from 'alemonjs'

import { isThereAUserPresent, ControlByBlood } from 'xiuxian-api'
import { user } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?徽章信息$/, async e => {
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
  e.reply('[协会执事]😳叶子凡\n暂未开放...')
})
