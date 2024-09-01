import { Messages } from 'alemonjs'
import { showUserMsg, createUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { user } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?(个人|個人)信息$/, async e => {
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
      user
        .update(
          {
            avatar: e.user_avatar
          },
          {
            where: {
              uid: UID
            }
          }
        )
        .then(() => {
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
