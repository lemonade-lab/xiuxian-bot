import { Image, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
import { pictureRender } from '@xiuxian/img/index'
import * as Server from '@xiuxian/statistics/index'
export default OnResponse(
  async e => {
    //
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const data = await Server.ringInformation(UID, e.UserAvatar)
    const img = await pictureRender('BagComponent', {
      data,
      theme: UserData?.theme ?? 'dark'
    })

    const Send = useSend(e)

    if (typeof img != 'boolean') {
      Send(Image(img, 'buffer'))
    }
  },
  'message.create',
  /^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))$/
)
