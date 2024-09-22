import { isUser, ControlByBlood } from 'xiuxian-api'
import { Op } from 'sequelize'
import * as DB from 'xiuxian-db'
import { Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    if (!(await ControlByBlood(e, UserData))) return

    const Send = useSend(e)

    if (UserData.pont_attribute == 1) {
      Send(Text('[城主府]巡逻军:\n城内切莫释放神识!'))
      return
    }
    // 战力
    const battle_power = UserData.battle_power ?? 20
    const LevelData = await DB.user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 3
        }
      })
      .then(res => res?.dataValues)
    // 有效距离为
    const distanceThreshold = (LevelData.realm ?? 1) * 10 + 50
    const minBattleBlood = 1
    const AllUser = await DB.user
      .findAll({
        attributes: [
          'id',
          'uid',
          'state',
          'battle_blood_now',
          'battle_power',
          'pont_x',
          'pont_y',
          'point_type',
          'name'
        ],
        where: {
          // 不是自己的UID
          uid: {
            [Op.ne]: UID
          },
          // 区域一样的玩家
          point_type: UserData.point_type,
          // 没有死亡的玩家
          age_state: 1,
          // 只能看到空闲玩家
          state: 0,
          // 只能看到血量大于1的玩家
          battle_blood_now: {
            [Op.gt]: minBattleBlood
          },
          // 只显示比自己战力低的
          battle_power: {
            [Op.lte]: battle_power + 3280
          },
          pont_x: {
            [Op.between]: [
              UserData.pont_x - distanceThreshold,
              UserData.pont_x + distanceThreshold
            ]
          },
          pont_y: {
            [Op.between]: [
              UserData.pont_y - distanceThreshold,
              UserData.pont_y + distanceThreshold
            ]
          },
          pont_z: {
            [Op.between]: [
              UserData.pont_z - distanceThreshold,
              UserData.pont_z + distanceThreshold
            ]
          }
        },
        // 战力高的在前面
        order: [['battle_power', 'DESC']],
        // 只显示十个玩家
        limit: 10
      })
      .then(res => res.map(item => item.dataValues))

    const msg: string[] = ['[附近道友]']
    for (const item of AllUser) {
      msg.push(
        `\n🔹标记:${item?.id},道号:${item.name}\n🩸${item?.battle_blood_now},战力:${item?.battle_power}`
      )
    }
    if (msg.length > 1) {
      Send(Text(msg.join('')))
    } else {
      Send(Text('附近空无一人'))
    }

    return
  },
  'message.create',
  /^(#|\/)?释放神识$/
)
