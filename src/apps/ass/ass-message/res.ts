import { isUser } from '@xiuxian/api/index'
import { pictureRender } from '@xiuxian/img/index'
import { ass, ass_typing, user_ass } from '@xiuxian/db/index'
import { Image, Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const Send = useSend(e)
    user_ass
      .findAll({
        where: {
          uid: UID
        },
        include: [
          {
            model: ass,
            include: [
              {
                model: ass_typing
              }
            ]
          }
        ]
      })
      .then(res => res.map(item => item?.dataValues))
      .then(async res => {
        if (res.length === 0) {
          Send(Text('未加入任何势力'))
          return
        }
        // 返回物品信息
        const img = await pictureRender('AssMessage', {
          data: res
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
  /^(#|\/)?势力信息$/
)
