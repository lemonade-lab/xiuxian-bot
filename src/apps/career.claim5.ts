import { Messages } from 'alemonjs'
import * as GameApi from 'xiuxian-core'
import { isThereAUserPresent, ControlByBlood } from 'xiuxian-api'
export default new Messages().response(/^(#|\/)?徽章信息$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  if (!(await ControlByBlood(e, UserData))) return
  e.reply('[协会执事]😳叶子凡\n暂未开放...')
})
