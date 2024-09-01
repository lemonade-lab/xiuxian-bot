import { Messages } from 'alemonjs'
import { isUser, ControlByBlood } from 'xiuxian-api'
export default new Messages().response(/^(#|\/)?徽章信息$/, async e => {
  const UID = e.user_id
  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return
  if (!(await ControlByBlood(e, UserData))) return
  e.reply('[协会执事]😳叶子凡\n暂未开放...')
})
