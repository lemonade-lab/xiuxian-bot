import { plugin, type AEvent } from 'alemonjs'
import {
  DB,
  isThereAUserPresent,
  GameApi,
  controlByName
} from '../../api/index.js'
export class Tianjigate extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?洗手$/, fnc: 'handWashing' },
        { reg: /^(#|\/)?天道祝福$/, fnc: 'blessing' },
        { reg: /^(#|\/)?天道降临$/, fnc: 'heavenlyWayComes' },
        { reg: /^(#|\/)?查阅[\u4e00-\u9fa5]+$/, fnc: 'serchTxt' },
        { reg: /^(#|\/)?天机资料$/, fnc: 'serchIf' }
      ]
    })
  }

  async serchIf(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '天机门'))) return
    const data: DB.TxtType[] = (await DB.txt.findAll({
      raw: true
    })) as any
    const txt: { id: number; name: string; doc: string }[] = data
    if (txt.length == 0) {
      e.reply('[天机门]朴声\n无记载')
    }
    const arr = ['[天机资料]']
    for await (const item of txt) {
      arr.push(`\n${item.name}`)
    }
    e.reply(arr)
    return
  }

  async serchTxt(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '天机门'))) return
    const name = e.msg.replace(/^(#|\/)?查阅/, '')
    // 查阅资料
    const data: DB.TxtType[] = (await DB.txt.findAll({
      where: {
        name: name
      },
      raw: true
    })) as any
    const txt: { id: number; name: string; doc: string }[] = data
    if (txt.length == 0) {
      e.reply('[天机门]朴声\n无记载')
    }
    for await (const item of txt) {
      e.reply(`[${item.name}]\n${item.doc}`, {
        quote: e.msg_id
      })
    }
    return
  }

  async handWashing(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '天机门'))) return
    const LevelData = await GameApi.Levels.read(UID, 1)
    if (LevelData.realm == 0) {
      e.reply('[天机门]李逍遥\n凡人不可捷越')
      return
    }
    if (UserData.special_prestige <= 0) {
      e.reply('[天机门]李逍遥\n你一身清廉')
      return
    }

    // 根据境界还不行 得取三维  煞气越少要的钱越多
    const size = 100 - UserData.special_prestige

    const r = LevelData.realm / 2

    const money = 98 * Math.floor(r < 1 ? 1 : r) * (size > 1 ? size : 1)

    const lingshi = await GameApi.Bag.searchBagByName(UID, '下品灵石')

    if (!lingshi || lingshi.acount < money) {
      e.reply(`[天机门]韩立\n清煞气需要[下品灵石]*${money}`)
      return
    }

    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: money
      }
    ])

    // 更新用户
    await GameApi.Users.update(UID, {
      special_prestige: UserData.special_prestige - 1
    } as DB.UserType)

    e.reply('[天机门]南宫问天\n为你清除[煞气]*1')
    return
  }
  /**
   * @param e
   * @returns
   */
  async blessing(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    /**
     * 检查背包
     */
    const UserData = await GameApi.Users.read(UID)
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    /**
     * 检查是否通过
     */
    if (!(await GameApi.Blessing.collectItems(UID))) {
      e.reply('[天机门]秦羽\n放肆')
      return
    }
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: '极品灵石',
        acount: 500
      }
    ])
    e.reply([`天地之灵渐渐凝成了[极品灵石]*500`], {
      quote: e.msg_id
    })
    return
  }

  /**
   * @param e
   * @returns
   */
  async heavenlyWayComes(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    // 检查背包
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    if (!(await GameApi.Compensate.verify(UID))) {
      e.reply('[天机门]秦羽\n放肆')
      return
    }
    const realm = await GameApi.Levels.read(UID, 1).then(item => item.realm)
    const size = (realm ?? 1) * 25
    const Size = size < 1000 ? size : 1000
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: '极品灵石',
        acount: Size
      }
    ])
    e.reply([`[天机门]秦羽:\n领取成功~`])
    e.reply(`天道之锁渐渐凝成了[极品灵石]*${Size}`, {
      quote: e.msg_id
    })
  }
}
