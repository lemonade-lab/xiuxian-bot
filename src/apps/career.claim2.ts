import { Messages } from 'alemonjs'
import { isThereAUserPresent, controlByName } from 'xiuxian-api'
import { user } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?炼器师学徒$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)
  if (!(await controlByName(e, UserData, '协会'))) return
  e.reply(['[协会执事]😳叶子凡\n', '目前职业炼丹师\n'])
})
