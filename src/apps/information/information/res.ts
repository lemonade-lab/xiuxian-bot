import { Text, useSend } from 'alemonjs'
import { showUserMsg, createUser } from '@xiuxian/api/index'
import * as GameApi from '@xiuxian/core/index'
import { user } from '@xiuxian/db/index'
export default OnResponse(
  async e => {
    //
    const UID = e.UserId
    //
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
              const Send = useSend(e)
              Send(Text('数据处理错误'))
            })
          })
      })
      .catch(err => {
        console.error(err)
        const Send = useSend(e)
        Send(Text('数据处理错误'))
      })

    return
  },
  'message.create',
  /^(#|\/)?(个人|個人)信息$/
)
