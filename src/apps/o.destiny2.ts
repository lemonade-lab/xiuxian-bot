import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?本命$/, async e => {
  const UID = e.user_id

  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return

  // 查看本命信息：武器名/等级/属性/精炼需要消耗提示
  const thing = await DB.user_fate
    .findOne({
      where: {
        uid: UID
      },
      include: {
        model: DB.goods
      }
    })
    .then(res => res?.dataValues)
  //
  if (!thing) {
    e.reply(['未有本命物品'], {
      quote: e.msg_id
    })
    return
  }
  // 查看消耗所需
  const data = await DB.fate_level
    .findOne({
      where: {
        grade: thing.grade
      }
    })
    .then(res => res?.dataValues)

  // 得到该境界经验
  const exp_gaspractice = await DB.user_level
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
  const exp_bodypractice = await DB.user_level
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
  const exp_soul = await DB.user_level
    .findOne({
      attributes: ['addition', 'realm', 'experience'],
      where: {
        uid: UID,
        type: 3
      }
    })
    .then(res => res?.dataValues)
    .then(res => res.experience)

  const goodThing = await GameApi.Goods.searchAllThing(thing.name)

  // 精炼等级*1000*物品等级
  const size = 1000 * goodThing.grade

  e.reply([
    `\n本命物:${thing.name}`,
    `\n等级:${thing.grade}`,
    `\n属性:${await GameApi.Talent.getTalentName(thing['good']['dataValues']['talent'])}`,
    `\n精炼所需物品:${thing.name}`,
    `\n精炼所需灵石:${size}`,
    `\n精炼所需修为:${exp_gaspractice}/${data.exp_gaspractice}`,
    `\n精炼所需气血:${exp_bodypractice}/${data.exp_bodypractice}`,
    `\n精炼所需魂念:${exp_soul}/${data.exp_soul}`
  ])
  return
})
