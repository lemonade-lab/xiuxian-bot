import { isUser } from '@xiuxian/api/index'
import { Bag, Cooling, Skills } from '@xiuxian/core/index'
import { user, user_skills } from '@xiuxian/db/index'
import { operationLock } from '@xiuxian/core/index'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    // lock
    const T = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }
    // is user
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    // message parse
    const text = useParse(e.Megs, 'Text')
    if (!text) return
    const thingName = text.replace(/^(#|\/)?(学习|學習)/, '')
    const thing = await Bag.searchBagByName(UID, thingName)
    if (!thing) {
      Send(Text(`没有[${thingName}]`))
      return
    }

    const AllSorcery = await user_skills
      .findAll({ where: { uid: UID } })
      .then(res => res.map(item => item?.dataValues))
    const islearned = AllSorcery.find(item => item.name == thingName)
    if (islearned) {
      Send(Text('学过了'))

      return
    }

    if (AllSorcery.length >= Cooling.myconfig_gongfa) {
      Send(Text('反复看了又看\n却怎么也学不进'))

      return
    }

    /**
     * 新增功法
     */
    await user_skills.create({ uid: UID, name: thing.name })

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
    }, 1000)
    await Bag.reduceBagThing(UID, [
      {
        name: thing.name,
        acount: 1
      }
    ])
    Send(Text(`学习[${thingName}]`))
    return
  },
  'message.create',
  /^(#|\/)?(学习|學習)[\u4e00-\u9fa5]+$/
)
