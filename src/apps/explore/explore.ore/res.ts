import { Text, useSend } from 'alemonjs'
import { isUser, ControlByBlood, killNPC, victoryCooling } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
import { user, user_level } from 'xiuxian-db'
/**
 *
 * @param grade
 * @returns
 */
function getMoneyGrade(grade: number) {
  if (grade == 1) return '下品'
  if (grade == 2) return '中品'
  if (grade == 3) return '上品'
  if (grade == 4) return '极品'
}
export default OnResponse(
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const T = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }

    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    if (!(await ControlByBlood(e, UserData))) return

    const text = useParse(e.Megs, 'Text')

    const [id, size] = text.replace(/^(#|\/)?采集/, '').split('*')

    // 看看境界
    const gaspractice = await user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 1
        }
      })
      .then(res => res?.dataValues)
      .then(item => item.realm)

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

    if (!(await killNPC(e, id, UID, UserData.special_prestige))) return

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

    // 增加物品
    await GameApi.Bag.addBagThing(UID, [
      {
        name: name,
        acount: ep.money * acount
      }
    ])

    // 减少灵力 保存灵力信息
    await user.update(
      {
        special_spiritual: UserData.special_spiritual - ep.spiritual * acount
      },
      {
        where: {
          uid: UID
        }
      }
    )

    // 设置冷却
    GameApi.Burial.set(UID, CDID, GameApi.Cooling.CD_Mine)

    //
    e.reply([`采得[${name}]*${ep.money * acount}`], {
      quote: e.msg_id
    })
    return
  },
  'message.create',
  /^(#|\/)?采集\d+\*?(1|2)?$/
)
