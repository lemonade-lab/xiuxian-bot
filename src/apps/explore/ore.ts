import {
  APlugin,
  Controllers,
  type MessageButtonType,
  type AEvent
} from 'alemonjs'
import {
  isThereAUserPresent,
  ControlByBlood,
  GameApi,
  killNPC,
  victoryCooling
} from 'xiuxian-api'

import * as DB from 'xiuxian-db'

export class Ore extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?采集\d+\*?(1|2)?$/, fnc: 'gather' },
        { reg: /^(#|\/)?探索灵矿$/, fnc: 'userSearchOre' }
      ]
    })
  }

  /**
   * 开采
   * @param e
   * @returns
   */
  async gather(e: AEvent) {
    const UID = e.user_id

    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await ControlByBlood(e, UserData))) return

    const [id, size] = e.msg.replace(/^(#|\/)?采集/, '').split('*')

    // 看看境界
    const gaspractice = await GameApi.Levels.read(UID, 1).then(
      item => item.realm
    )

    const acount = Number(
      size == '' || size == undefined || gaspractice < 25 || Number(size) > 2
        ? 1
        : size
    )

    // 检查
    if (!(await GameApi.Bag.searchBagByName(UID, '开灵铲', acount))) {
      e.reply([`开灵铲不足${acount}个`], {
        quote: e.msg_id
      })
      return
    }

    // 冷却检查
    const CDID = 22
    if (!(await victoryCooling(e, UID, CDID))) return

    if (!killNPC(e, id, UID, UserData.special_prestige)) return

    // 得到灵矿
    const explore = await GameApi.explore.explorecache(UserData.point_type)

    const ep = explore[id]

    // 是否在城里 是否存在  是否充足
    if (UserData.pont_attribute == 1 || !ep || ep.acount < 1) {
      e.reply([`这里没有[${id}],去别处看看吧`], {
        quote: e.msg_id
      })
      return
    }

    // 灵力不足
    if (UserData.special_spiritual <= ep.spiritual * acount) {
      e.reply([`灵力不足${ep.spiritual * acount}`], {
        quote: e.msg_id
      })
      return
    }

    // 减少灵矿
    await GameApi.explore.reduce(UserData.point_type, id, acount)

    // 减少铲子
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: '开灵铲',
        acount: 1 * acount
      }
    ])

    // 得到该灵矿的数据
    const name = `${getMoneyGrade(ep.grade)}灵石`

    // let thing: { name: string; type: number; acount: number }[] = []

    // let x = Math.floor(UserData.special_prestige / 10)

    // if (x > 1) {
    //   x = 1
    // }

    // let s = x + 1

    // if (GameApi.Method.isTrueInRange(1, 100, x)) {
    //   thing = await GameApi.Bag.delThing(UID, s * 10, true)
    // }
    // if (thing.length != 0) {
    //   GameApi.logs.write(UID, {
    //     type: 3,
    //     create_time: new Date().getTime(),
    //     message: `[路过的盗贼]趁你不注意时偷走了[${thing[0].name}]*${thing[0].acount}`
    //   } as DB.UserLogType)
    // }

    // 增加物品
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: name,
        acount: ep.money * acount
      }
    ])

    // 减少灵力 保存灵力信息
    await GameApi.Users.update(UID, {
      special_spiritual: UserData.special_spiritual - ep.spiritual * acount
    })

    // 设置冷却
    GameApi.Burial.set(UID, CDID, GameApi.Cooling.CD_Mine)

    //
    e.reply([`采得[${name}]*${ep.money * acount}`], {
      quote: e.msg_id
    })
    return
  }

  /**
   * 探索灵矿
   * @param e
   * @returns
   */
  async userSearchOre(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await ControlByBlood(e, UserData))) return
    if (UserData.pont_attribute == 1) {
      e.reply('[城主府]巡逻军:\n城内切莫释放神识!')
      return
    }
    // 得到位置名
    const name = await GameApi.Map.getPlaceName(
      UserData.point_type,
      UserData.pont_attribute
    )
    // 消息
    const msg: string[] = [`[${name}]的灵矿`]
    // 得到灵矿
    const explore = await GameApi.explore.explorecache(UserData.point_type)
    for (const item in explore) {
      msg.push(
        `\n🔹标记:${item}(${getMoneyGrade(explore[item].grade)}灵矿)*${
          explore[item].acount
        }`
      )
    }
    const m = Controllers(e).Message
    // 采集
    e.reply(msg).then(() => {
      // 分开发送。
      const arrs: MessageButtonType[][] = []
      let arr: MessageButtonType[] = []
      for (const item in explore) {
        arr.push({
          label: `${getMoneyGrade(explore[item].grade)}`,
          value: `/采集${item}*1`
        })
        if (arr.length >= 5) {
          arrs.push(arr)
          arr = []
        }
      }
      for (const item in explore) {
        arr.push({
          label: `${getMoneyGrade(explore[item].grade)}*2`,
          value: `/采集${item}*2`
        })
        if (arr.length >= 5) {
          arrs.push(arr)
          arr = []
        }
      }
      if (arr.length >= 1) {
        if (arr.length < 5) {
          arr.push({
            label: `采集`,
            value: `/采集`,
            enter: false
          })
        }
        arrs.push(arr)
      }
      m.reply('', ...arrs)
    })
  }
}

function getMoneyGrade(grade: number) {
  if (grade == 1) return '下品'
  if (grade == 2) return '中品'
  if (grade == 3) return '上品'
  if (grade == 4) return '极品'
}
