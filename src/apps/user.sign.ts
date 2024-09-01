import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { Bag, Method } from 'xiuxian-core'
import { user } from 'xiuxian-db'
const MoenySize = 10
export default new Messages().response(/^(#|\/)(签到|联盟签到)$/, async e => {
  const UID = e.user_id
  //
  const UserData = await isUser(e, UID)
  //
  if (typeof UserData === 'boolean') return
  // 看看上次的时间
  const time = new Date()
  let size = 0
  if (UserData.sign_in_time) {
    if (Method.isSameDay(UserData.sign_in_time, time)) {
      e.reply('今日已签到')
      return
    }
    if (Method.isSameYearAndMonth(UserData.sign_in_time, time)) {
      size = 0
      // 更新 + 1
      await user.update(
        {
          sign_in_count: UserData.sign_in_count + 1,
          sign_in_month_count: 0,
          sign_in_time: time
        },
        {
          where: {
            uid: UID
          }
        }
      )
      //
    } else {
      size = UserData.sign_in_month_count + 1
      // 更新 + 1
      await user.update(
        {
          sign_in_count: UserData.sign_in_count + 1,
          sign_in_month_count: UserData.sign_in_month_count + 1,
          sign_in_time: time
        },
        {
          where: {
            uid: UID
          }
        }
      )
    }
  } else {
    size = 0
    // 更新 + 1
    await user.update(
      {
        sign_in_count: UserData.sign_in_count + 1,
        sign_in_month_count: 0,
        sign_in_time: time
      },
      {
        where: {
          uid: UID
        }
      }
    )
  }
  //
  const count = MoenySize + Math.floor(size / 3)

  // 增加灵石
  Bag.addBagThing(UID, [
    {
      name: '极品灵石',
      acount: count
    }
  ])
  //
  e.reply(`极品灵石+${count}`)

  return
})
