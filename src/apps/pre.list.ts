import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import { picture } from 'xiuxian-img'
import * as Server from 'xiuxian-statistics'
export default new Messages().response(/^(#|\/)?杀神榜$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const data = await Server.getKillList()
  const img = await picture.render('KillComponent', {
    name: UID,
    props: {
      data
    }
  })
  if (typeof img != 'boolean') e.reply(img)
})
