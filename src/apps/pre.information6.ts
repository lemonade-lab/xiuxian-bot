import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?设置密码/, async e => {
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
