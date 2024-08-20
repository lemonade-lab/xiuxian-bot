import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import { user_log } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?删除记录$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  user_log.destroy({
    where: {
      uid: UID
    }
  })
  e.reply(['你的的状态记录\n已删除'], {
    quote: e.msg_id
  })
})
