import { Messages } from 'alemonjs'
import { isUser, ControlByBlood } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
function getMoneyGrade(grade: number) {
  if (grade == 1) return '下品'
  if (grade == 2) return '中品'
  if (grade == 3) return '上品'
  if (grade == 4) return '极品'
}
export default new Messages().response(/^(#|\/)?探索灵矿$/, async e => {
  const UID = e.user_id

  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return

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

  // 采集
  e.reply(msg)
})
