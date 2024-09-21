import { isUser, controlByName } from 'xiuxian-api'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    if (!(await controlByName(e, UserData, '协会'))) return
    e.reply(['[协会执事]😳叶子凡\n', '待开放'])
  },
  'message.create',
  /^(#|\/)?阵法师学徒$/
)
