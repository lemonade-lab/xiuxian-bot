import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import { picture } from 'xiuxian-img'
import * as Server from 'xiuxian-statistics'
export default new Messages().response(
  /^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))$/,
  async e => {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const data = await Server.ringInformation(UID, e.user_avatar)
    const img = await picture.render('RingComponent', {
      props: {
        data
      },
      name: UID
    })
    if (typeof img != 'boolean') e.reply(img)
  }
)
