import { Image, Text, useSend } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { operationLock } from 'xiuxian-core'
import { transactions } from 'xiuxian-db'
import { pictureRender } from 'xiuxian-img'
export default OnResponse(
  async e => {
    const T = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }
    //
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    transactions
      .findAll({
        where: {
          uid: UID
        }
      })
      .then(res => res.map(item => item?.dataValues))
      .then(async res => {
        if (res.length === 0) {
          Send(Text('没有找到数据'))
          return
        }

        // 返回物品信息
        const img = await pictureRender('TransactionMessage', {
          name: 'TransactionMessage',
          props: {
            data: {
              page: 1,
              goods: res
            },
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
      .catch(err => {
        console.error(err)
        Send(Text('数据错误'))
      })
  },
  'message.create',
  /^(#|\/)?我(出售|售出)的$/
)
