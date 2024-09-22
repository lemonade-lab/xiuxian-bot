import { isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
import { Text, useSend } from 'alemonjs'
const reGiveup = {}
export default OnResponse(
  async e => {
    // 操作锁
    const T = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }
    // 检查用户
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const thing = await DB.user_fate
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)
    //
    if (!thing) {
      Send(Text('未有本命物品'))
      return
    }

    // 不存在 或者过期了
    if (!reGiveup[UID] || reGiveup[UID] + 30000 < new Date().getTime()) {
      reGiveup[UID] = new Date().getTime()
      Send(
        Text(['[重要提示]\n请30s内再次发送[/命解]', '\n以确认命解'].join(''))
      )
      return
    }

    // 根据物品等级来消耗气血  1000
    const size = thing.grade * 1000
    // 看看经验
    const LevelMsg = await DB.user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 2
        }
      })
      .then(res => res?.dataValues)
    if (LevelMsg.experience < size) {
      Send(Text(`需要消耗[气血]*${size}~`))
      return
    }

    const BagSize = await GameApi.Bag.backpackFull(UID)
    // 背包未位置了直接返回了
    if (!BagSize) {
      Send(Text('储物袋空间不足'))
      return
    }

    // 清除询问
    delete reGiveup[UID]

    // 减少气血
    await GameApi.Levels.reduceExperience(UID, 1, size)
    // 返回物品
    await GameApi.Bag.addBagThing(UID, [
      {
        name: thing.name,
        acount: thing.grade + 1
      }
    ])
    // 删除数据
    await DB.user_fate.destroy({
      where: {
        uid: UID
      }
    })
    Send(Text(`成功从灵根处取出[${thing.name}]`))
    return
  },
  'message.create',
  /^(#|\/)?命解$/
)
