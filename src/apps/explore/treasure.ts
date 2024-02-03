import { plugin, type AEvent, ClientVILLA, Controllers } from 'alemonjs'
import {
  DB,
  isThereAUserPresent,
  ControlByBlood,
  GameApi
} from '../../api/index.js'
export class Treasure extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?探索宝物$/, fnc: 'exploringTreasures' },
        { reg: /^(#|\/)?拾取\d+$/, fnc: 'pickup' }
      ]
    })
  }

  /**
   * 探索宝物
   * @param e
   * @returns
   */
  async exploringTreasures(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await ControlByBlood(e, UserData))) return
    if (UserData.pont_attribute == 1) {
      e.reply('[城主府]巡逻军:\n城内切莫释放神识!')
      return
    }
    const LevelData = await GameApi.Levels.read(UID, 3)
    const distanceThreshold = (LevelData.realm ?? 1) * 10 + 50
    const da: DB.MapTreasureType[] = (await DB.map_treasure.findAll({
      attributes: ['id', 'type', 'x', 'y', 'z', 'name', 'acount'],
      where: {
        type: UserData.point_type,
        x: {
          [DB.Op.between]: [
            UserData.pont_x - distanceThreshold,
            UserData.pont_x + distanceThreshold
          ]
        },
        y: {
          [DB.Op.between]: [
            UserData.pont_y - distanceThreshold,
            UserData.pont_y + distanceThreshold
          ]
        },
        z: {
          [DB.Op.between]: [
            UserData.pont_z - distanceThreshold,
            UserData.pont_z + distanceThreshold
          ]
        }
      },
      // 只显示十个
      limit: 10,
      raw: true
    })) as any
    if (da.length == 0) {
      e.reply('附近没有宝物')
      return
    }
    const msg = ['[附近宝物]']
    for await (const item of da) {
      msg.push(`\n🔹标记:${item.id} 物品:${item.name} 数量:${item.acount}`)
    }

    if (e.platform != 'villa') {
      e.reply(msg)
      return
    }

    let x = 1
    let y = 99
    const bt = da
      .filter(item => item?.name)
      .map(item => {
        x++
        y--
        return {
          id: `${x}${y}`,
          text: `${item.name}`,
          type: 1,
          c_type: 2,
          input: `/拾取${item.id}`,
          need_callback: false,
          extra: 'shiqu'
        }
      })

    Controllers(e).Message.card([
      {
        content: {
          text: msg.join('')
        },
        panel: ClientVILLA.buttonAutomaticArrangement(bt)
      }
    ])

    return
  }

  /**
   * 拾取
   * @param e
   * @returns
   */
  async pickup(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await ControlByBlood(e, UserData))) return
    const LevelData = await GameApi.Levels.read(UID, 3)
    const distanceThreshold = (LevelData.realm ?? 1) * 10 + 50
    const ID = e.msg.replace(/^(#|\/)?拾取/, '')
    const data: DB.MapTreasureType = (await DB.map_treasure.findOne({
      attributes: ['id', 'type', 'x', 'y', 'z', 'name', 'acount'],
      where: {
        id: ID,
        type: UserData.point_type,
        x: {
          [DB.Op.between]: [
            UserData.pont_x - distanceThreshold,
            UserData.pont_x + distanceThreshold
          ]
        },
        y: {
          [DB.Op.between]: [
            UserData.pont_y - distanceThreshold,
            UserData.pont_y + distanceThreshold
          ]
        },
        z: {
          [DB.Op.between]: [
            UserData.pont_z - distanceThreshold,
            UserData.pont_z + distanceThreshold
          ]
        }
      },
      raw: true
    })) as any
    if (!data) {
      e.reply(['在想屁吃?'], {
        quote: e.msg_id
      })
      return
    }
    // 判断储物袋大小,不够的就不推送
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    // 添加
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: data.name,
        acount: data.acount
      }
    ])
    // 删除该物品
    await DB.map_treasure.destroy({
      where: {
        id: ID
      }
    })
    e.reply([`你拾取了[${data.name}]*${data.acount}`], {
      quote: e.msg_id
    })
    return
  }
}
