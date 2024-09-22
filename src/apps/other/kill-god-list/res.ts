import { Image, useSend } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { pictureRender } from 'xiuxian-img'
import * as Server from 'xiuxian-statistics'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const data = await Server.getKillList()
    const img = await pictureRender('KillComponent', {
      name: UID,
      props: {
        data,
        theme: UserData?.theme ?? 'dark'
      }
    })
    const Send = useSend(e)
    if (typeof img != 'boolean') {
      Send(Image(img))
    }
  },
  'message.create',
  /^(#|\/)?杀神榜$/
)
