import { createUser } from 'xiuxian-api'
import { pictureRender } from 'xiuxian-img'
import * as GameApi from 'xiuxian-core'
import * as Server from 'xiuxian-statistics'
import { user } from 'xiuxian-db'
export default OnResponse(
  async e => {
    const UID = e.UserId
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
              name: UID,
              props: {
                data: res,
                theme: UserData?.theme ?? 'dark'
              }
            }).then(img => {
              if (typeof img != 'boolean') {
                e.reply(img)
              }
            })
          })
        })
      })
      .catch(() => {
        e.reply('数据查询错误')
      })

    return
  },
  'message.create',
  /^(#|\/)?功法信息$/
)
