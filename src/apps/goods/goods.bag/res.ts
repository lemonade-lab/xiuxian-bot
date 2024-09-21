import { isUser } from 'xiuxian-api'
import { pictureRender } from 'xiuxian-img'
import { backpackInformation } from 'xiuxian-statistics'
import { Goods } from 'xiuxian-core'
export default OnResponse(
  async e => {
    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const text = useParse(e.Megs, 'Text')

    const type = text.replace(/^(#|\/)?(储物袋|儲物袋|背包)/, '')
    const data = await backpackInformation(
      e.UserId,
      e.UserAvatar,
      Goods.mapType[type] ?? Goods.mapType['道具']
    )

    const img = await pictureRender('BagComponent', {
      props: { data, theme: UserData?.theme ?? 'dark' },
      name: UID
    })
    if (typeof img != 'boolean') e.reply(img)
    return
  },
  'message.create',
  /^(#|\/)?(储物袋|儲物袋|背包)(武器|护具|法宝|丹药|功法|道具|材料|装备)?$/
)
