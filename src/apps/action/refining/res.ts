import { isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    // 操作锁
    const TT = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!TT) {
      Send(Text('操作频繁'))
      return
    }
    // 检查用户
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const T = await DB.user_fate
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)
    if (T) {
      Send(Text('已有本命物品'))
      return
    }
    // 解析
    const text = useParse(e.Megs, 'Text')
    const thingName = text.replace(/^(#|\/)?炼化/, '')
    const bagThing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!bagThing) {
      Send(Text(`没[${thingName}]`))
      return
    }
    // 根据物品等级来消耗修为  1000
    const size = bagThing.grade * 1000
    // 看看经验
    const LevelMsg = await DB.user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 1
        }
      })
      .then(res => res?.dataValues)
    if (LevelMsg.experience < size) {
      Send(Text(`需要消耗[修为]*${size}~`))
      return
    }
    // 减少修为
    await GameApi.Levels.reduceExperience(UID, 1, size)
    // 新增数据
    await DB.user_fate.create({
      uid: UID,
      name: bagThing.name,
      grade: 0
    })
    // 减少物品
    await GameApi.Bag.reduceBagThing(UID, [{ name: thingName, acount: 1 }])
    // 更新面板?
    await GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now)
    // 返回
    Send(Text(`炼化[${bagThing.name}]`))
    return
  },
  'message.create',
  /^#炼化[\u4e00-\u9fa5]+$/
)
