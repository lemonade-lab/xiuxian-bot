import { Image, Text, useParse, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
import { Cooling } from '@xiuxian/core/index'
import { ass } from '@xiuxian/db/index'
import { pictureRender } from '@xiuxian/img/index'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const text = useParse(e.Megs, 'Text')
    const p = text.replace(/^(#|\/)?势力/, '')
    const page = p == '' ? 1 : Number(p)
    //
    const pageSize = Cooling.pageSize
    // 长度
    const totalCount = await ass.count()
    //
    const totalPages = Math.ceil(totalCount / pageSize)
    if (page > totalPages) return

    const Send = useSend(e)

    const limit = pageSize
    const offset = (page - 1) * pageSize

    // 宗门数据
    ass
      .findAll({
        limit: limit,
        offset: offset
      })
      .then(res => res.map(item => item?.dataValues))
      .then(async res => {
        if (res.length === 0) {
          Send(Text('没有找到数据'))
          return
        }
        // 宗门信息
        const img = await pictureRender('AssList', {
          data: res,
          theme: UserData.theme
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
