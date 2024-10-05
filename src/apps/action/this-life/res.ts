import { isUser } from '@xiuxian/api/index'
import { Text, useSend } from 'alemonjs'
import { fate_level, goods, user_fate, user_level } from '@xiuxian/db/index'
import { Goods, Talent } from '@xiuxian/core/index'
export default OnResponse(
  async e => {
    // 操作锁
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    // 查看本命信息：武器名/等级/属性/精炼需要消耗提示
    const thing = await user_fate
      .findOne({
        where: {
          uid: UID
        },
        include: {
          model: goods
        }
      })
      .then(res => res?.dataValues)
    const Send = useSend(e)
    if (!thing) {
      Send(Text('未有本命物品'))
      return
    }
    // 查看消耗所需
    const data = await fate_level
      .findOne({
        where: {
          grade: thing.grade
        }
      })
      .then(res => res?.dataValues)
    // 得到该境界经验
    const exp_gaspractice = await user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 1
        }
      })
      .then(res => res?.dataValues)
      .then(res => res.experience)
    //
    const exp_bodypractice = await user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 2
        }
      })
      .then(res => res?.dataValues)
      .then(res => res.experience)
    //
    const exp_soul = await user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 3
        }
      })
      .then(res => res?.dataValues)
      .then(res => res.experience)

    const goodThing = await Goods.searchAllThing(thing.name)

    // 精炼等级*1000*物品等级
    const size = 1000 * goodThing.grade

    Send(
      Text(
        [
          `本命物:${thing.name}`,
          `等级:${thing.grade}`,
          `属性:${await Talent.getTalentName(thing['good']['dataValues']['talent'])}`,
          `精炼所需物品:${thing.name}`,
          `精炼所需灵石:${size}`,
          `精炼所需修为:${exp_gaspractice}/${data.exp_gaspractice}`,
          `精炼所需气血:${exp_bodypractice}/${data.exp_bodypractice}`,
          `精炼所需魂念:${exp_soul}/${data.exp_soul}`
        ].join('\n')
      )
    )

    return
  },
  'message.create',
  /^(#|\/)?本命$/
)
