import { Text, useParse, useSend } from 'alemonjs'
import * as DB from 'xiuxian-db'
export default OnResponse(
  async e => {
    const text = useParse(e.Megs, 'Text')
    const didian = text.replace(/(#|\/)?切换绑定/, '')
    const [switchuid, bindinguid] = didian.split('*') //切换前的uid,要绑定的平台uid
    if (!switchuid || !bindinguid) return
    //查询出所有要切换的uid user数据
    const user = await DB.user
      .findOne({
        where: { uid: switchuid },
        attributes: {
          exclude: ['id', 'uid'] // 指定要排除的列名
        }
      })
      .then(res => res?.dataValues)
    const Send = useSend(e)
    if (!user) {
      Send(Text('查无此人'))
      return
    }
    const user_bag = await DB.user_bag
      .findAll({
        where: { uid: switchuid },
        attributes: {
          exclude: ['id'] // 指定要排除的列名
        }
      })
      .then(res => res.map(item => item?.dataValues))
    const user_ass = await DB.user_ass
      .findAll({
        where: { uid: switchuid },
        attributes: {
          exclude: ['id', 'uid'] // 指定要排除的列名
        }
      })
      .then(res => res.map(item => item?.dataValues))
    const user_equipment = await DB.user_equipment
      .findAll({
        where: { uid: switchuid },
        attributes: {
          exclude: ['id', 'uid'] // 指定要排除的列名
        }
      })
      .then(res => res.map(item => item?.dataValues))
    const user_fate = await DB.user_fate
      .findAll({
        where: { uid: switchuid },
        attributes: {
          exclude: ['id', 'uid'] // 指定要排除的列名
        }
      })
      .then(res => res.map(item => item?.dataValues))
    const user_ring = await DB.user_ring
      .findAll({
        where: { uid: switchuid },
        attributes: {
          exclude: ['id', 'uid'] // 指定要排除的列名
        }
      })
      .then(res => res.map(item => item?.dataValues))
    const user_level = await DB.user_level
      .findAll({
        where: { uid: switchuid },
        attributes: {
          exclude: ['id', 'uid'] // 指定要排除的列名
        }
      })
      .then(res => res.map(item => item?.dataValues))
    const user_skill = await DB.user_skills
      .findAll({
        where: { uid: switchuid },
        attributes: {
          exclude: ['id'] // 指定要排除的列名
        }
      })
      .then(res => res.map(item => item?.dataValues))
    //然后切换
    await DB.user.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    await DB.user.update(user, { where: { uid: bindinguid } })
    await DB.user_ring.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_ring.length; index++) {
      user_ring[index].uid = bindinguid
      await DB.user_ring.create(user_ring[index])
    }
    await DB.user_fate.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_fate.length; index++) {
      user_fate[index].uid = bindinguid
      await DB.user_fate.create(user_fate[index])
    }

    await DB.user_equipment.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_equipment.length; index++) {
      user_equipment[index].uid = bindinguid
      await DB.user_equipment.create(user_equipment[index])
    }
    await DB.user_ass.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_ass.length; index++) {
      user_ass[index].uid = bindinguid
      await DB.user_ass.create(user_ass[index])
    }

    await DB.user_bag.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_bag.length; index++) {
      user_bag[index].uid = bindinguid
      await DB.user_bag.create(user_bag[index])
    }
    await DB.user_level.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_level.length; index++) {
      await DB.user_level.update(user_level[index], {
        where: { uid: bindinguid, type: user_level[index].type }
      })
    }
    await DB.user_skills.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_skill.length; index++) {
      user_skill[index].uid = bindinguid
      await DB.user_skills.create(user_skill[index])
    }
    Send(Text(`已切换至${bindinguid}`))
    return
  },
  'message.create',
  /^#切换绑定(.*)*$/
)
