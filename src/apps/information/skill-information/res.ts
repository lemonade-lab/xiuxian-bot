import { createUser } from '@xiuxian/api/index'
import { pictureRender } from '@xiuxian/img/index'
import * as GameApi from '@xiuxian/core/index'
import * as Server from '@xiuxian/statistics/index'
import { user } from '@xiuxian/db/index'
import { Image, Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const Send = useSend(e)
    user
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)
      .then(UserData => {
        if (!UserData) {
          createUser(e)
          return
        }
        GameApi.Skills.updataEfficiency(UID, UserData.talent).then(() => {
          Server.skillInformation(UID, e.UserAvatar).then(res => {
            pictureRender('SkillsComponent', {
              data: res,
              theme: UserData?.theme ?? 'dark'
            }).then(img => {
              if (typeof img != 'boolean') {
                Send(Image(img))
              }
            })
          })
        })
      })
      .catch(err => {
        console.error(err)
        Send(Text('数据处理错误'))
      })

    return
  },
  'message.create',
  /^(#|\/)?功法信息$/
)
