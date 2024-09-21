import { isUser } from 'xiuxian-api'
import { pictureRender } from 'xiuxian-img'
import * as Server from 'xiuxian-statistics'
export default OnResponse(
  async e => {
    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const data = await Server.ringInformation(UID, e.UserAvatar)
    const img = await pictureRender('BagComponent', {
      props: {
        data,
        theme: UserData?.theme ?? 'dark'
      },
      name: UID
    })
    if (typeof img != 'boolean') e.reply(img)
  },
  'message.create',
  /^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))$/
)
