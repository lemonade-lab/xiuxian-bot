import { Text, useSend } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { operationLock } from 'xiuxian-core'
import { Redis } from 'xiuxian-db'

/**
 *
 */
const rules = [
  { dayOfWeek: [2, 4], hour: 12, minute: 0 }, // 二四 12:00
  { dayOfWeek: [2, 4], hour: 13, minute: 59 }, // 二四 14:00
  { dayOfWeek: [1, 3, 5], hour: 18, minute: 0 }, // 一三五 18:00
  { dayOfWeek: [1, 3, 5], hour: 19, minute: 59 }, // 一三五 20:00
  { dayOfWeek: 6, hour: 20, minute: 0 }, // 周六 20:00
  { dayOfWeek: 6, hour: 21, minute: 59 } // 周六 21:00
]

/**
 *
 * @returns
 */
const isActivityOpen = () => {
  const now = new Date()
  return rules.some(
    rule =>
      (Array.isArray(rule.dayOfWeek)
        ? rule.dayOfWeek.includes(now.getDay())
        : rule.dayOfWeek === now.getDay()) &&
      rule.hour === now.getHours() &&
      now.getMinutes() <= rule.minute
  )
}

export default OnResponse(
  async e => {
    // const UID = e.UserId
    // // lock
    // const T = await operationLock(UID)
    // const Send = useSend(e)
    // if (!T) {
    //   Send(Text('操作频繁'))
    //   return
    // }
    // //
    // if (!isActivityOpen()) {
    //   Send(Text('当前时间不在活动时间内'))
    //   return
    // }
    // const UserData = await isUser(e, UID)
    // if (typeof UserData === 'boolean') return
    // // 查看boss信息
    // const boss = await Redis.get('xiuxian:boss:info')
    // if (!boss) {
    //   Send(Text('BOSS正在降临,请稍后再试'))
    //   return
    // }
    // const Now = new Date()
    //
  },
  'message.create',
  /^(#|\/)?(BOSS|boss|Boss)信息/
)
