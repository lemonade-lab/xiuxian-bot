import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { pictureRender } from 'xiuxian-img'
import * as Server from 'xiuxian-statistics'
export default new Messages().response(
  /^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))$/,
  async e => {
    const UID = e.user_id

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const data = await Server.ringInformation(UID, e.user_avatar)
    const img = await pictureRender('BagComponent', {
      props: {
        data,
        theme: UserData?.theme ?? 'dark'
      },
      name: UID
    })
    if (typeof img != 'boolean') e.reply(img)
  }
)
