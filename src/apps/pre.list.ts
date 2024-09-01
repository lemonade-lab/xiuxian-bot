import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { picture } from 'xiuxian-img'
import * as Server from 'xiuxian-statistics'
export default new Messages().response(/^(#|\/)?杀神榜$/, async e => {
  const UID = e.user_id

  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return

  const data = await Server.getKillList()
  const img = await picture.render('KillComponent', {
    name: UID,
    props: {
      data,
      theme: UserData?.theme ?? 'dark'
    }
  })
  if (typeof img != 'boolean') e.reply(img)
})
