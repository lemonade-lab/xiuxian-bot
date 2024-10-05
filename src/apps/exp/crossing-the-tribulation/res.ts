import { Text, useSend } from 'alemonjs'
import { isUser, punishLevel } from '@xiuxian/api/index'
import * as GameApi from '@xiuxian/core/index'
import * as DB from '@xiuxian/db/index'
export default OnResponse(
  async e => {
    // lock start
    const T = await GameApi.operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }

    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    if (!(await GameApi.Levels.isLevelPoint(UID, 1))) {
      Send(Text('尚未感知到雷劫'))
      return
    }

    //雷劫次数
    let num = 0
    // 概率
    /**
     * 开始触发
     */
    setTimeout(() => {
      Send(Text('云聚霞散露真形，天雷滚滚预兆生....'))
    }, 1500)
    setTimeout(() => {
      Send(Text('忽然间风云变幻,乌云密布,竟然是九九灭世之雷悬于苍穹之上！'))
    }, 3000)
    setTimeout(() => {
      Send(Text(`${UserData.name}屹立于此，眼含决意。灵气凝聚，雷霆万钧`))
    }, 4500)
    /**
     * 进入渡劫模式
     */
    let time = setInterval(async function () {
      GameApi.State.set(UID, {
        actionID: 5,
        startTime: 7,
        endTime: 6
      })
      let variable: number = Math.random() * (400000 - 340000) + 340000
      if (UserData.battle_blood_now > 0) {
        if (num) {
          num++
          Send(
            Text(`本次雷劫造成的伤害为 ${Math.floor(variable)},恭喜 ${UserData.name} 成功挺过了雷劫.\n
          请做好准备，下一道雷劫将在一分钟后降临！
          `)
          )
        } else {
          GameApi.State.del(UID)
          Send(Text(`${UserData.name}成功渡过最后一道雷劫,渡劫成仙`))
          await DB.user_level.update(
            { realm: 42 },
            { where: { uid: UID, type: 1 } }
          )
          clearInterval(time)
        }
      } else {
        GameApi.State.del(UID)
        await punishLevel(e, UID, UserData)
        punishLevel(e, UID, UserData)
        clearInterval(time)
      }
    }, 60000) // 每分钟执行一次
  },
  'message.create',
  /^(#|\/)?渡劫$/
)
