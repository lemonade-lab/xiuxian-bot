import { Text, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
import { Bag, Method } from '@xiuxian/core/index'
import { user } from '@xiuxian/db/index'
const MoenySize = 10
export default OnResponse(
  async e => {
    //
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    //
    const time = new Date()
    let size = 0

    const Send = useSend(e)

    if (UserData.sign_in_time) {
      if (Method.isSameDay(UserData.sign_in_time, time)) {
        Send(Text('今日已签到'))
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

    Send(Text(`极品灵石+${count}`))

    return
  },
  'message.create',
  /^(#|\/)(签到|联盟签到)$/
)
