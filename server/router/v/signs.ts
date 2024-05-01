import koaRouter from 'koa-router'
import { ERROE_CODE, OK_CODE } from '../../config/ajax'
import { ass, user, UserType } from '../../../src/db'
import { addBagThing } from '../../../src/model/users/additional/bag'
const router = new koaRouter({ prefix: '/api/v1/signs' })

// 判断是否是同一天
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

// 判断是否是同年同月
const isSameYearAndMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  )
}

// 签到
router.get('/in', async ctx => {
  const UID = ctx.state.user.uid
  await user
    .findOne({
      where: {
        uid: UID
      },
      raw: true
    })
    .then((res: any) => res)
    .then(async (res: UserType) => {
      if (res) {
        // 看看上次的时间
        const time = new Date()
        let size = 0
        if (res.sign_in_time) {
          console.log('res.sign_in_time', res.sign_in_time)
          if (isSameDay(res.sign_in_time, time)) {
            console.log('已经签到')
            ctx.body = {
              code: OK_CODE,
              msg: '今日已签到',
              data: 0
            }
            return
          }
          if (isSameYearAndMonth(res.sign_in_time, time)) {
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
        }
        // 增加灵石
        addBagThing(UID, res.bag_grade, [
          {
            name: '极品灵石',
            acount: 5 + Math.floor(size / 3)
          }
        ])
        res.sign_in_month_count += 1
        res.sign_in_count += 1
        res.sign_in_time = time
        ctx.body = {
          code: OK_CODE,
          msg: `极品灵石+${size}`,
          data: res
        }
        return
      }
      ctx.body = {
        code: ERROE_CODE,
        msg: '查询错误',
        data: null
      }
    })
    .catch(err => {
      console.log(err)
      ctx.body = {
        code: ERROE_CODE,
        msg: '服务器错误',
        data: null
      }
    })
})

export default router
