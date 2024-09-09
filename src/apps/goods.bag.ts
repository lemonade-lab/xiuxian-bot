import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { pictureRender } from 'xiuxian-img'
import { backpackInformation } from 'xiuxian-statistics'
import { Goods } from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?(储物袋|儲物袋|背包)(武器|护具|法宝|丹药|功法|道具|材料|装备)?$/,
  async e => {
    const UID = e.user_id

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const type = e.msg.replace(/^(#|\/)?(储物袋|儲物袋|背包)/, '')
    const data = await backpackInformation(
      e.user_id,
      e.user_avatar,
      Goods.mapType[type] ?? Goods.mapType['道具']
    )

    const img = await pictureRender('BagComponent', {
      props: { data, theme: UserData?.theme ?? 'dark' },
      name: UID
    })
    if (typeof img != 'boolean') e.reply(img)
    return
  }
)
