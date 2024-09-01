import { Messages } from 'alemonjs'
import { isUser, controlByName } from 'xiuxian-api'
export default new Messages().response(/^(#|\/)?炼器师学徒$/, async e => {
  const UID = e.user_id
  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return
  if (!(await controlByName(e, UserData, '协会'))) return
  e.reply(['[协会执事]😳叶子凡\n', '目前职业炼丹师\n'])
})
