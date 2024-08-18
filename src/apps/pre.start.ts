import { Messages } from 'alemonjs'
import { showUserMsg } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?踏入仙途$/, async e => {
  /**
   * *******
   * lock start
   * *******
   */
  const KEY = `xiuxian:open:${e.user_id}`
  const LOCK = await DB.Redis.get(KEY)
  if (LOCK) {
    e.reply('操作频繁')
    return
  }
  await DB.Redis.set(KEY, 1, 'EX', 6)
  /**
   * lock end
   */

  const UID = e.user_id

  //
  DB.user
    .findOne({
      attributes: ['uid'],
      where: {
        uid: e.user_id
      }
    })
    .then(res => res?.dataValues)
    .then(async res => {
      if (!res) {
        // 刷新用户信息
        GameApi.Player.updatePlayer(UID, e.user_avatar)
          .then(() => {
            // 设置冷却
            GameApi.Burial.set(UID, 8, GameApi.Cooling.CD_Reborn)
            e.reply(
              [`修仙大陆第${res.id}位萌新`, '\n发送[/修仙帮助]了解更多'],
              {
                quote: e.msg_id
              }
            )
            // 显示资料
            showUserMsg(e)
          })
          .catch(_ => {
            e.reply(['未寻得仙缘'], {
              quote: e.msg_id
            })
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
