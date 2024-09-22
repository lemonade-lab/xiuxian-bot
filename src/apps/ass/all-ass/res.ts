import { Image, Text, useParse, useSend } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { ass } from 'xiuxian-db'
import { pictureRender } from 'xiuxian-img'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const text = useParse(e.Megs, 'Text')
    const p = text.replace(/^(#|\/)?势力/, '')
    const page = p == '' ? 1 : Number(p)
    const pageSize = GameApi.Cooling.pageSize
    const totalCount = await ass.count()
    const totalPages = Math.ceil(totalCount / pageSize)
    if (page > totalPages) return

    const Send = useSend(e)

    //
    ass
      .findAll({
        limit: GameApi.Cooling.pageSize,
        offset: (page - 1) * GameApi.Cooling.pageSize
      })
      .then(res => res.map(item => item.dataValues))
      .then(async res => {
        if (res.length === 0) {
          Send(Text('没有找到数据'))
          return
        }
        // 返回物品信息
        const img = await pictureRender('AssList', {
          name: 'AssList',
          props: {
            data: res,
            theme: UserData.theme
          }
        })
        //
        if (Buffer.isBuffer(img)) {
          Send(Image(img))
        } else {
          Send(Text('截图错误'))
        }
      })
    return
  },
  'message.create',
  /^(#|\/)?势力\d*$/
)
