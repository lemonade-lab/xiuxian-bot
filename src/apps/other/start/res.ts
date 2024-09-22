import { showUserMsg } from 'xiuxian-api'
import { user } from 'xiuxian-db'
import { Player, Burial, Cooling } from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
import { Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    // lock start
    const T = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }

    const UID = e.UserId

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
          Player.updatePlayer(UID, e.UserAvatar)
            .then(() => {
              // 设置冷却
              Burial.set(UID, 8, Cooling.CD_Reborn)

              Send(
                Text(
                  [
                    `修仙大陆第${res.id}位萌新`,
                    '\n发送[/修仙帮助]了解更多'
                  ].join('')
                )
              )

              // 显示资料
              showUserMsg(e)
            })
            .catch(err => {
              console.error('err', err)
              Send('数据查询错误')
            })
        } else {
          // 显示资料
          showUserMsg(e)
        }
      })
      .catch(err => {
        console.error('err', err)
        Send('数据查询错误')
      })

    return
  },
  'message.create',
  /^(#|\/)?踏入仙途$/
)
