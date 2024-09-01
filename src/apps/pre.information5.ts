import { Messages } from 'alemonjs'
import { showUserMsg, createUser } from 'xiuxian-api'
import { Themes } from 'xiuxian-img'
import * as GameApi from 'xiuxian-core'
import { user } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?更换主题$/, async e => {
  //
  const UID = e.user_id

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
      // 得到配置
      const index = Themes.indexOf(UserData.theme)
      // 如果存在
      if (Themes[index + 1]) {
        // 切换
        UserData.theme = Themes[index + 1]
        // 保存
      } else {
        // 不存在。返回第一个
        UserData.theme = Themes[0]
      }
      user
        .update(
          {
            avatar: e.user_avatar,
            theme: UserData.theme
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
          ]).catch(() => {
            e.reply('数据处理错误')
          })
        })
    })
    .catch(() => {
      e.reply('数据查询错误')
    })

  //
})
