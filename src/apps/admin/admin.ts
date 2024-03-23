import { plugin, type AEvent } from 'alemonjs'
import { DB } from '../../api/index.js'

export class Admins extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?切换绑定(.*)*$/,
          fnc: 'switch'
        }
      ]
    })
  }

  /**
   * 切换绑定平台
   * @param e
   * @returns
   */
  async switch(e: AEvent) {
    const UID = e.user_id
    if (!(await DB.admin.findOne({ where: { account: UID }, raw: true })))
      return
    const didian = e.msg.replace(/(#|\/)?切换绑定/, '')
    const [switchuid, bindinguid] = didian.split('*') //切换前的uid,要绑定的平台uid
    if (!switchuid || !bindinguid) return
    //查询出所有要切换的uid user数据
    const user: DB.UserType = (await DB.user.findOne({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid'] // 指定要排除的列名
      },
      raw: true
    })) as any
    if (!user) return e.reply('查无此人')
    const user_blessing: DB.UserBlessingType = (await DB.user_blessing.findOne({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid'] // 指定要排除的列名
      },
      raw: true
    })) as any
    const user_bag = (await DB.user_bag.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id'] // 指定要排除的列名
      },
      raw: true
    })) as any
    const user_ass: DB.UserAssType[] = (await DB.user_ass.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid'] // 指定要排除的列名
      },
      raw: true
    })) as any
    const user_equipment: DB.UserEquipmentType[] =
      (await DB.user_equipment.findAll({
        where: { uid: switchuid },
        attributes: {
          exclude: ['id', 'uid'] // 指定要排除的列名
        },
        raw: true
      })) as any
    const user_compensate: DB.UserCompensateType =
      (await DB.user_compensate.findOne({
        where: { uid: switchuid },
        attributes: {
          exclude: ['id', 'uid'] // 指定要排除的列名
        },
        raw: true
      })) as any
    const user_fate: DB.UserFateType[] = (await DB.user_fate.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid'] // 指定要排除的列名
      },
      raw: true
    })) as any
    const user_ring: DB.UserRingType[] = (await DB.user_ring.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid'] // 指定要排除的列名
      },
      raw: true
    })) as any
    const user_level = (await DB.user_level.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid'] // 指定要排除的列名
      },
      raw: true
    })) as any
    const user_skill = (await DB.user_skills.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id'] // 指定要排除的列名
      },
      raw: true
    })) as any
    //然后切换
    await DB.user.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    await DB.user.update(user, { where: { uid: bindinguid } })
    await DB.user_blessing.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    await DB.user_blessing.update(user_blessing, { where: { uid: bindinguid } })
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

    await DB.user_compensate.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    await DB.user_compensate.update(user_compensate, {
      where: { uid: bindinguid }
    })
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
    e.reply(`已切换至${bindinguid}`)
    return
  }
}
