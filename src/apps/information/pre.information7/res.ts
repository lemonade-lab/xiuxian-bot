import { isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import { operationLock } from 'xiuxian-core'
export default OnResponse(
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const T = await operationLock(e.UserId)
    if (!T) {
      e.reply('操作频繁')
      return
    }
    /**
     * lock end
     */

    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const text = useParse(e.Megs, 'Text')

    const email = text.replace(/^(#|\/)?设置邮箱/, '')
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
          }
        })
        .then(res => res.dataValues)
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
  },
  'message.create',
  /^(#|\/)?设置邮箱/
)
