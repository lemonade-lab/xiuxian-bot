import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { user_log } from 'xiuxian-db'
import { Method } from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?状态记录$/, async e => {
  const UID = e.user_id

  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return

  const logsData = await user_log
    .findAll({
      attributes: ['type', 'create_time', 'message'],
      where: {
        uid: UID
      },
      order: [
        ['create_time', 'DESC'] // 降序排列
      ],
      limit: 10
    })
    .then(res => res.map(item => item.dataValues))

  /**
   * 查询后
   * 顺带把 没查到的数据都删除了
   * 确保只留下最新的10条记录
   */

  user_log
    .findAll({
      attributes: ['type', 'create_time', 'message'],
      where: {
        uid: UID
      },
      order: [
        ['create_time', 'DESC'] // 降序排列
      ]
    })
    .then(res => res.map(item => item.dataValues))
    .then(res => {
      // 删除多余的记录
      for (const item of res) {
        const find = logsData.find(i => i.id == item.id)
        // 不是前十的记录都删除
        if (!find) {
          user_log.destroy({
            where: {
              id: item.id
            }
          })
        }
      }
    })

  const msg = ['[状态记录]']

  if (logsData.length == 0) {
    e.reply('未存在任何记录', {
      quote: e.msg_id
    })
    return
  }

  const map = {
    1: '偷袭',
    2: '打劫',
    3: '窃取'
  }

  for (const item of logsData) {
    msg.push(
      `\n[${map[item.type]}][${Method.timeChange(item.create_time)}]${item.message}`
    )
  }

  e.reply(msg)
})
