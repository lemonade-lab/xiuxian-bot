import { Text, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
import * as DB from '@xiuxian/db/index'
export default OnResponse(
  async e => {
    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const Send = useSend(e)

    //查看数据是否存在
    const data = await DB.sky
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)

    if (data) {
      Send(Text('已进入'))

      return
    }

    Send(Text('进入通天塔'))

    await DB.sky.create({
      uid: UID
    })
  },
  'message.create',
  /^(#|\/)?进入通天塔$/
)
