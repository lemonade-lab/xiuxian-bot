import { isUser, ControlByBlood } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    if (!(await ControlByBlood(e, UserData))) return
    // 查看数据是否存在
    const text = useParse(e.Megs, 'Text')
    const address = text.replace(/^(#|\/)?(传送|傳送)/, '')
    const position = await DB.map_position
      .findOne({
        where: {
          name: address
        }
      })
      .then(res => res?.dataValues)
    const Send = useSend(e)
    if (!position) {
      Send(Text('未知地点'))
      return
    }
    const LevelData = await DB.user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 1
        }
      })
      .then(res => res?.dataValues)
    if (!LevelData) return
    if (LevelData.realm < position.grade - 1) {
      Send(Text('境界不足'))
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
      Send(Text('请前往传送阵'))
      return
    }
    if (LevelData.realm > 12) {
      const acount = GameApi.Cooling.delivery_size
      const lingshi = await GameApi.Bag.searchBagByName(UID, '下品灵石')
      if (!lingshi || lingshi.acount < acount) {
        Send(Text(`[修仙联盟]守阵老者:\n你似乎没有${acount}*[下品灵石]`))
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
        await DB.user.update(
          {
            pont_x: mx,
            pont_y: my,
            pont_z: mz,
            point_type: position.type, // 地点
            pont_attribute: position.attribute // 属性
          },
          {
            where: {
              uid: UID
            }
          }
        )
        Send(Text(`[修仙联盟]守阵老者:\n传送成功`))
      }, 1000 * time)
    )
    // 传送行为记录
    await GameApi.State.set(UID, {
      actionID: 4,
      startTime: new Date().getTime(), // 开始时间
      endTime: 1000 * time
    })
    Send(Text(`[修仙联盟]守阵老者:\n传送对接${address}\n需要${time}秒`))
    return
  },
  'message.create',
  /^(#|\/)?(传送|傳送)[\u4e00-\u9fa5]+$/
)
