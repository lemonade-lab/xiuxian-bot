import { isUser } from 'xiuxian-api'
import { pictureRender } from 'xiuxian-img'
import { ass, ass_typing, user_ass } from 'xiuxian-db'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
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
      .then(res => res.map(item => item.dataValues))
      .then(async res => {
        if (res.length === 0) {
          e.reply('未加入任何势力', {
            quote: e.msg_id
          })
          return
        }
        // 返回物品信息
        const img = await pictureRender('AssMessage', {
          name: 'AssMessage',
          props: {
            data: res
          }
        })
        //
        if (Buffer.isBuffer(img)) {
          e.reply(img)
        } else {
          e.reply('截图错误')
        }
      })

    return
  },
  'message.create',
  /^(#|\/)?势力信息$/
)
