import { isUser, ControlByBlood } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import * as DB from 'xiuxian-db'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    if (!(await ControlByBlood(e, UserData))) return
    if (UserData.pont_attribute == 1) {
      e.reply('[城主府]巡逻军:\n城内切莫释放神识!')
      return
    }
    const name = await GameApi.Map.getPlaceName(
      UserData.point_type,
      UserData.pont_attribute
    )
    const MonsterData = await DB.levels
      .findAll({
        attributes: ['name'],
        where: {
          type: 0
        }
      })
      .then(res => res.map(item => item.dataValues))
    const monster = await GameApi.Monster.monsterscache(UserData.point_type)
    // monster 是一个对象 需要先按等级排序
    const sortedMonsters = Object.keys(monster).sort(
      (a, b) => monster[a].level - monster[b].level
    )
    if (sortedMonsters.length == 0) {
      e.reply('附近无怪物', {
        quote: e.msg_id
      })
      return
    }
    const msg: string[] = [`[${name}]的妖怪`]
    for (const item of sortedMonsters) {
      msg.push(
        `\n${item}(${MonsterData[monster[item].level]?.name})*${
          monster[item].acount
        }`
      )
    }
    e.reply(msg).then(() => {
      // 分开发送。
      const arrs: MessageButtonType[][] = []
      let arr: MessageButtonType[] = []
      for (const item of sortedMonsters) {
        arr.push({ label: item, value: `/击杀${item}` })
        if (arr.length >= 3) {
          arrs.push(arr)
          arr = []
        }
      }
      if (arr.length >= 1) {
        arrs.push(arr)
      }
    })
    return
  },
  'message.create',
  /^(#|\/)?探索怪物$/
)
