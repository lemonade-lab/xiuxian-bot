import { Messages } from 'alemonjs'
import { showUserMsg } from 'xiuxian-api'
import { user } from 'xiuxian-db'
import { Player, Burial, Cooling } from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?踏入仙途$/, async e => {
  /**
   * *******
   * lock start
   * *******
   */
  const T = await operationLock(e.user_id)
  if (!T) {
    e.reply('操作频繁')
    return
  }
  /**
   * lock end
   */

  const UID = e.user_id

  user
    .findOne({
      attributes: ['uid'],
      where: { uid: UID }
    })
    .then(res => res?.dataValues)
    .then(res => {
      // 不存在
      if (!res) {
        // 刷新用户信息
        Player.updatePlayer(UID, e.user_avatar)
          .then(() => {
            // 设置冷却
            Burial.set(UID, 8, Cooling.CD_Reborn)
            //
            e.reply(
              [`修仙大陆第${res.id}位萌新`, '\n发送[/修仙帮助]了解更多'],
              { quote: e.msg_id }
            )
            // 显示资料
            showUserMsg(e)
          })
          .catch(() => {
            //
            e.reply(['未寻得仙缘'], { quote: e.msg_id })
          })
      } else {
        // 显示资料
        showUserMsg(e)
      }
    })
    .catch(_ => {
      e.reply('数据查询错误')
    })

  return
})
