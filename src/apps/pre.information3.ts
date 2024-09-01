import { Messages } from 'alemonjs'
import { createUser } from 'xiuxian-api'
import { picture } from 'xiuxian-img'
import * as GameApi from 'xiuxian-core'
import * as Server from 'xiuxian-statistics'
import { user } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?面板信息$/, async e => {
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
      GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now).then(() => {
        Server.equipmentInformation(UID, e.user_avatar).then(res => {
          picture
            .render('Equipmentcomponent', {
              name: UID,
              props: {
                data: res
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
