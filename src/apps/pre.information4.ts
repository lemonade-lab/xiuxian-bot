import { Messages } from 'alemonjs'
import { createUser } from 'xiuxian-api'
import { picture } from 'xiuxian-img'
import * as GameApi from 'xiuxian-core'
import * as Server from 'xiuxian-statistics'
import { user } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?功法信息$/, async e => {
  const UID = e.user_id
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
        Server.skillInformation(UID, e.user_avatar).then(res => {
          picture
            .render('SkillsComponent', {
              name: UID,
              props: {
                data: res,
                theme: UserData?.theme ?? 'dark'
              }
            })
            .then(img => {
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
})
