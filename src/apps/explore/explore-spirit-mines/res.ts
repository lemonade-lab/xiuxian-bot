import { Text, useSend } from 'alemonjs'
import { isUser, ControlByBlood } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
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
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    if (!(await ControlByBlood(e, UserData))) return
    const Send = useSend(e)
    if (UserData.pont_attribute == 1) {
      Send(Text('[城主府]巡逻军:\n城内切莫释放神识!'))
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
    Send(Text(msg.join('')))
  },
  'message.create',
  /^(#|\/)?探索灵矿$/
)
