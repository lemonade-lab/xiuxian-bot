import { showUserMsg, createUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
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
        user
          .update(
            {
              avatar: e.UserAvatar
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
  },
  'message.create',
  /^(#|\/)?(个人|個人)信息$/
)
