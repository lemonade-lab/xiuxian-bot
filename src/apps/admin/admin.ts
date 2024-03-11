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
    const user_ass: DB.UserAssType = (await DB.user_ass.findOne({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid'] // 指定要排除的列名
      },
      raw: true
    })) as any
    const user_equipment: DB.UserEquipmentType =
      (await DB.user_equipment.findOne({
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
    const user_fate: DB.UserFateType = (await DB.user_fate.findOne({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid'] // 指定要排除的列名
      },
      raw: true
    })) as any
    const user_ring: DB.UserRingType = (await DB.user_ring.findOne({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id', 'uid'] // 指定要排除的列名
      },
      raw: true
    })) as any
    const user_level = (await DB.user_level.findAll({
      where: { uid: switchuid },
      attributes: {
        exclude: ['id'] // 指定要排除的列名
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
    await DB.user_ring.update(user_ring, { where: { uid: bindinguid } })
    await DB.user_fate.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    await DB.user_fate.update(user_fate, { where: { uid: bindinguid } })
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
    await DB.user_equipment.update(user_equipment, {
      where: { uid: bindinguid }
    })
    await DB.user_ass.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    await DB.user_ass.update(user_ass, { where: { uid: bindinguid } })

    await DB.user_bag.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_bag.length; index++) {
      await DB.user_bag.update(user_bag[index], {
        where: { uid: user_bag[index].uid }
      })
    }

    await DB.user_level.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_level.length; index++) {
      await DB.user_level.update(user_level[index], {
        where: { uid: user_level[index].uid }
      })
    }

    await DB.user_skills.update(
      { uid: switchuid + '-1' },
      { where: { uid: switchuid } }
    )
    for (let index = 0; index < user_skill.length; index++) {
      await DB.user_skills.update(user_skill[index], {
        where: { uid: user_skill[index].uid }
      })
    }
    e.reply(`已切换至${bindinguid}`)
    return
  }
}
