import { Image, Text, useParse, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
import { operationLock } from '@xiuxian/core/index'
import { transactions } from '@xiuxian/db/index'
import { pictureRender } from '@xiuxian/img/index'
export default OnResponse(
  async e => {
    // lock
    const T = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }
    // is user
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    // message parse
    const text = useParse(e.Megs, 'Text')
    const [xpage = '1', name] = text
      .replace(/^(#|\/)?虚空镜/, '')
      .trim()
      .split('*')

    const where: {
      name?: string
    } = {}

    if (name !== undefined) {
      where.name = name
    }

    // 添加分页参数
    const page = parseInt(xpage) || 1 // 当前页数，默认为1
    const pageSize = 10 // 每页数据数量，默认为10
    const offset = (page - 1) * pageSize // 计算偏移量

    //
    transactions
      .findAll({
        where: where,
        limit: pageSize,
        offset: offset
      })
      .then(res => res.map(item => item?.dataValues))
      .then(async res => {
        if (res.length === 0) {
          Send(Text('没有找到数据'))
          return
        }
        // 返回物品信息
        const img = await pictureRender('TransactionMessage', {
          data: {
            page: page,
            goods: res
          },
          theme: UserData.theme
        })

        //
        if (Buffer.isBuffer(img)) {
          Send(Image(img, 'buffer'))
        } else {
          Send(Text('截图错误'))
        }
      })
      .catch(err => {
        console.error(err)
        Send(Text('数据错误'))
      })
  },
  'message.create',
  /^(#|\/)?虚空镜/
)
