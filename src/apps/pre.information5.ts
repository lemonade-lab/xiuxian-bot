import { Messages } from 'alemonjs'
import { showUserMsg, isUser, createUser } from 'xiuxian-api'
import { Themes } from 'xiuxian-img'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?更换主题$/, async e => {
  const UID = e.user_id
  isUser(UID)
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
      // 更新主题后。
      GameApi.Users.update(UID, {
        avatar: e.user_avatar,
        theme: UserData.theme
      }).then(() => {
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
})
