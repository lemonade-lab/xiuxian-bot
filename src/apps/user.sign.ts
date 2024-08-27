import { Messages } from 'alemonjs'
import { Bag, Method } from 'xiuxian-core'
import { user } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)签到$/, async e => {
  const UID = e.user_id
  await user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)
    .then(async res => {
      if (res) {
        // 看看上次的时间
        const time = new Date()
        let size = 0
        if (res.sign_in_time) {
          if (Method.isSameDay(res.sign_in_time, time)) {
            e.reply('今日已签到')
            return
          }
          if (Method.isSameYearAndMonth(res.sign_in_time, time)) {
            size = 0
            // 更新 + 1
            await user.update(
              {
                sign_in_count: res.sign_in_count + 1,
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
            size = res.sign_in_month_count + 1
            // 更新 + 1
            await user.update(
              {
                sign_in_count: res.sign_in_count + 1,
                sign_in_month_count: res.sign_in_month_count + 1,
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
              sign_in_count: res.sign_in_count + 1,
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
        const count = 5 + Math.floor(size / 3)
        // 增加灵石
        Bag.addBagThing(UID, [
          {
            name: '极品灵石',
            acount: count
          }
        ])
        e.reply(`极品灵石+${count}`)
        return
      }
      e.reply('查询错误')
    })
    .catch(err => {
      console.log(err)
      e.reply('服务器错误')
    })
  return
})
