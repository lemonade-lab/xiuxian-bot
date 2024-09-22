import { Text, useParse, useSend } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
export default OnResponse(
  async e => {
    // 获取用户信息
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    // 解析密码
    const text = useParse(e.Megs, 'Text')
    const password = text.replace(/^(#|\/)?设置密码/, '')
    var regex = /^[a-zA-Z0-9]+$/
    const Send = useSend(e)
    if (!regex.test(password)) {
      Send(Text('密码必须只包含数字或字母'))
      return
    } else if (password.length < 6 || password.length > 22) {
      Send(Text('密码大于6位或小于22位'))
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
            Send(Text('设置错误'))
          } else {
            Send(Text('设置成功'))
          }
        })
        .catch(() => {
          Send(Text('设置错误'))
        })
    }
    return
  },
  'message.create',
  /^(#|\/)?设置密码/
)
