import { Messages } from 'alemonjs'
import {
  showUserMsg,
  isUser,
  createUser,
  isThereAUserPresent
} from 'xiuxian-api'
import { Themes, picture } from 'xiuxian-img'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import * as Server from 'xiuxian-statistics'

const message = new Messages()

message.response(/^(#|\/)?我的编号$/, async e => {
  e.reply(e.user_id)
})

message.response(/^(#|\/)?(个人|個人)信息$/, async e => {
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

message.response(/^(#|\/)?面板信息$/, async e => {
  const UID = e.user_id
  isUser(UID)
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

message.response(/^(#|\/)?功法信息$/, async e => {
  const UID = e.user_id
  isUser(UID)
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

message.response(/^(#|\/)?更换主题$/, async e => {
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
message.response(/^(#|\/)?设置密码/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const password = e.msg.replace(/^(#|\/)?设置密码/, '')
  var regex = /^[a-zA-Z0-9]+$/

  if (!regex.test(password)) {
    e.reply('密码必须只包含数字或字母')
    return
  } else if (password.length < 6 || password.length > 22) {
    e.reply('密码大于6位或小于22位')
    return
  } else {
    // 更新用户密码
    DB.user
      .update(
        {
          password: password
        },
        {
          where: {
            uid: UID
          }
        }
      )
      .then(res => {
        if (res.includes(0)) {
          e.reply('设置错误')
        } else {
          e.reply('设置成功')
        }
      })
      .catch(() => {
        e.reply('数据错误')
      })
  }
  return
})

message.response(/^(#|\/)?设置邮箱/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const email = e.msg.replace(/^(#|\/)?设置邮箱/, '')
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!regex.test(email)) {
    e.reply('非法格式')
    return
  } else {
    // 查询

    const res = await DB.user
      .findOne({
        where: {
          email: email
        },
        raw: true
      })
      .then(res => {
        if (res) {
          e.reply('已被使用')
          return false
        }
        return true
      })
      .catch(() => {
        e.reply('数据错误')
        return false
      })

    if (!res) return

    // 更新信息
    DB.user
      .update(
        {
          email: email
        },
        {
          where: {
            uid: UID
          }
        }
      )
      .then(res => {
        if (res.includes(0)) {
          e.reply('设置错误')
        } else {
          e.reply('设置成功')
        }
      })
      .catch(() => {
        e.reply('数据错误')
      })
  }
  return
})

export const Information = message.ok
