import { Messages } from 'alemonjs'
import * as GameApi from 'xiuxian-core'
import { isThereAUserPresent, controlByName } from 'xiuxian-api'
export default new Messages().response(/^(#|\/)?阵法师学徒$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  if (!(await controlByName(e, UserData, '协会'))) return
  e.reply(['[协会执事]😳叶子凡\n', '待开放'])
})
