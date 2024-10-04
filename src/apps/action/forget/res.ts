import { isUser } from 'xiuxian-api'
import { Bag, Skills } from 'xiuxian-core'
import { user, user_skills } from 'xiuxian-db'
import { operationLock } from 'xiuxian-core'
import { Text, useParse, useSend } from 'alemonjs'
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
    // 解析
    const text = useParse(e.Megs, 'Text')
    if (!text) return
    const thingName = text.replace(/^(#|\/)?忘掉/, '')
    const AllSorcery = await user_skills
      .findAll({ where: { uid: UID } })
      .then(res => res.map(item => item?.dataValues))
    const islearned = AllSorcery.find(item => item.name == thingName)
    if (!islearned) {
      Send(Text(`没学过[${thingName}]`))
      return
    }
    // 检查背包
    const BagSize = await Bag.backpackFull(UID)
    if (!BagSize) {
      Send(Text('储物袋空间不足'))
      return
    }
    // 直接删
    await user_skills.destroy({ where: { uid: UID, name: thingName } })
    // 更新天赋
    setTimeout(async () => {
      const UserData = await user
        .findOne({
          where: {
            uid: UID
          }
        })
        .then(res => res?.dataValues)
      await Skills.updataEfficiency(UID, UserData.talent)
    }, 500)
    await Bag.addBagThing(UID, [{ name: islearned.name, acount: 1 }])
    Send(Text(`忘掉[${thingName}]`))
  },
  'message.create',
  /^(#|\/)?忘掉[\u4e00-\u9fa5]+$/
)
