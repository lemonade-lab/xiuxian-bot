import { isUser, ControlByBlood, endAllWord } from 'xiuxian-api'
import { Op, literal } from 'sequelize'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
export default OnResponse(
  async e => {
    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    // 闭关等长期状态自动结束
    if (UserData.state == 1 || UserData.state == 2 || UserData.state == 8) {
      await endAllWord(e, UID, UserData)
      e.reply('[自动结束]闭关/打坐/锻体', {
        quote: e.msg_id
      })
      return
    }
    if (!(await ControlByBlood(e, UserData))) return

    const text = useParse(e.Megs, 'Text')

    // 检查地点
    const address = text.replace(/^(#|\/)?前往/, '')
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
    const LevelsMsg = await DB.user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 1
        }
      })
      .then(res => res?.dataValues)

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
  },
  'message.create',
  /^(#|\/)?前往[\u4e00-\u9fa5]+$/
)
