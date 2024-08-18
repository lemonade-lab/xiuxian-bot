import { Messages } from 'alemonjs'
import { showUserMsg, isUser, createUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?(个人|個人)信息$/, async e => {
  const UID = e.user_id
  isUser(UID)
    .then(UserData => {
      if (!UserData) {
        createUser(e)
        return
      }
      GameApi.Users.update(UID, {
        avatar: e.user_avatar
      }).then(() => {
        Promise.all([
          GameApi.Skills.updataEfficiency(UID, UserData.talent),
          GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now),
          showUserMsg(e)
        ]).catch(err => {
          console.error(err)
          e.reply('数据处理错误')
        })
      })
    })
    .catch(() => {
      e.reply('数据查询错误')
    })

  return
})
