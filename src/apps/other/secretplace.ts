import { APlugin, Controllers, type AEvent } from 'alemonjs'
import {
  isThereAUserPresent,
  sendReply,
  ControlByBlood,
  endAllWord
} from 'xiuxian-api'
import { Op, literal } from 'sequelize'

import * as DB from 'xiuxian-db'

import * as GameApi from 'xiuxian-core'
export class Secretplace extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?位置信息$/, fnc: 'showCity' },
        { reg: /^(#|\/)?前往[\u4e00-\u9fa5]+$/, fnc: 'forward' },
        { reg: /^(#|\/)?返回$/, fnc: 'falsePiont' },
        { reg: /^(#|\/)?(传送|傳送)[\u4e00-\u9fa5]+$/, fnc: 'delivery' }
      ]
    })
  }

  async showCity(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    const PositionData = await DB.map_point
      .findAll({})
      .then(res => res.map(item => item.dataValues))
    const msg: string[] = []
    for await (const item of PositionData) {
      if (
        item?.z == UserData.pont_z &&
        item?.attribute == UserData.pont_attribute &&
        item?.type == UserData.point_type
      ) {
        msg.push(
          `\n地点名:${item?.name}\n坐标(${item?.x},${item?.y},${item?.z})`
        )
      }
    }
    sendReply(e, '[位置信息]', msg)
    return
  }

  async falsePiont(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    // 不是赶路状态
    if (UserData.state == 3) {
      // 取消行为
      const id = await GameApi.Place.get(UID)
      if (id) clearTimeout(id)
      // 清除行为
      GameApi.move.cancelJob(UID)
      e.reply(['已站在原地'], {
        quote: e.msg_id
      })
      return
    }
    if (UserData.state == 4) {
      await GameApi.State.del(UID)
      // 取消行为
      const id = await GameApi.Place.get(UID)
      if (id) {
        clearTimeout(id)
      }
      e.reply(['已取消传送'], {
        quote: e.msg_id
      })
      return
    }
    return
  }

  async forward(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    // 闭关等长期状态自动结束
    if (UserData.state == 1 || UserData.state == 2 || UserData.state == 8) {
      await endAllWord(e, UID, UserData)
      e.reply('[自动结束]闭关/打坐/锻体', {
        quote: e.msg_id
      })
      return
    }
    if (!(await ControlByBlood(e, UserData))) return
    // 检查地点
    const address = e.msg.replace(/^(#|\/)?前往/, '')
    // 得到地点数据
    const point = await DB.map_point
      .findOne({
        order: [
          [
            literal(`CASE
          WHEN x >= ${UserData.pont_x - 200} AND x <= ${
            UserData.pont_x + 200
          } THEN 0
          ELSE ABS(x - ${UserData.pont_x})
        END`),
            'ASC'
          ],
          [
            literal(`CASE
          WHEN y >= ${UserData.pont_y - 200} AND y <= ${
            UserData.pont_y + 200
          } THEN 0
          ELSE ABS(y - ${UserData.pont_y})
        END`),
            'ASC'
          ]
        ],
        where: {
          name: {
            [Op.like]: `%${address}%`
          }
        }
      })
      .then(res => res?.dataValues)

    // 判断
    if (!point) {
      e.reply([`未知地点[${address}]`], {
        quote: e.msg_id
      })
      return
    }

    // 判断
    const LevelsMsg = await GameApi.Levels.read(UID, 1)

    // 境界不足
    if (LevelsMsg.realm < point.grade - 1) {
      e.reply('[修仙联盟]守境者:\n道友境界不足,请留步')
      return
    }

    // 3秒一次
    const time = 3000

    // 步伐控制
    const size = 15 + UserData.battle_speed / 5

    await GameApi.move.setJob(UID, point.x, point.y, point.z, size)

    const { hours, minutes, seconds, totalMilliseconds } =
      GameApi.move.estimateTotalExecutionTime(
        UserData.pont_x,
        UserData.pont_y,
        point.x,
        point.y,
        size,
        time
      )

    const msg = GameApi.Method.timeChange(
      new Date().getTime() + totalMilliseconds
    )

    e.reply(
      [
        `正在前往,${point.name}...`,
        `\n预计到达时间(${hours}h${minutes}m${seconds}s):`,
        `\n${msg}`
      ],
      {
        quote: e.msg_id
      }
    )
    return
  }

  async delivery(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await ControlByBlood(e, UserData))) return
    const address = e.msg.replace(/^(#|\/)?(传送|傳送)/, '')
    const position = await DB.map_position
      .findOne({
        where: {
          name: address
        }
      })
      .then(res => res?.dataValues)
    if (!position) {
      e.reply(['未知地点'], {
        quote: e.msg_id
      })
      return
    }
    const LevelData = await GameApi.Levels.read(UID, 1)
    if (!LevelData) return
    if (LevelData.realm < position.grade - 1) {
      e.reply('[修仙联盟]守阵老者\n道友请留步', {
        quote: e.msg_id
      })
      return
    }

    // 找到传送阵
    const PointData = await DB.map_point
      .findOne({
        where: {
          x: UserData.pont_x,
          y: UserData.pont_y,
          z: UserData.pont_z
        }
      })
      .then(res => res?.dataValues)
    if (!PointData) {
      e.reply(['请前往传送阵'], {
        quote: e.msg_id
      })

      Controllers(e).Message.reply('', [
        {
          label: '传送阵',
          value: '/前往传送阵'
        }
      ])

      return
    }
    if (LevelData.realm > 12) {
      const acount = GameApi.Cooling.delivery_size
      const lingshi = await GameApi.Bag.searchBagByName(UID, '下品灵石')
      if (!lingshi || lingshi.acount < acount) {
        e.reply(`[修仙联盟]守阵老者:\n需要花费${acount}*[下品灵石]`)
        return
      }
      await GameApi.Bag.reduceBagThing(UID, [
        {
          name: '下品灵石',
          acount: acount
        }
      ])
    }
    const mx =
        Math.floor(Math.random() * (position.x2 - position.x1)) +
        Number(position.x1),
      my =
        Math.floor(Math.random() * (position.y2 - position.y1)) +
        Number(position.y1),
      mz =
        Math.floor(Math.random() * (position.z2 - position.z1)) +
        Number(position.z1)
    const x = UserData.pont_x
    const y = UserData.pont_y
    const the = Math.floor(
      ((x - mx >= 0 ? x - mx : mx - x) + (y - my >= 0 ? y - my : my - y)) / 100
    )
    const time = the > 0 ? the : 1
    // 设置定时器,并得到定时器id
    await GameApi.Place.set(
      UID,
      setTimeout(async () => {
        // 这里清除行为
        await GameApi.State.del(UID)
        await GameApi.Users.update(UID, {
          pont_x: mx,
          pont_y: my,
          pont_z: mz,
          point_type: position.type, // 地点
          pont_attribute: position.attribute // 属性
        })
        e.reply([`成功传送至${address}`], {
          quote: e.msg_id
        })
      }, 1000 * time)
    )
    // 传送行为记录
    await GameApi.State.set(UID, {
      actionID: 4,
      startTime: new Date().getTime(), // 开始时间
      endTime: 1000 * time
    })
    e.reply(`[修仙联盟]守阵老者:\n传送对接${address}\n需要${time}秒`)
    return
  }
}
