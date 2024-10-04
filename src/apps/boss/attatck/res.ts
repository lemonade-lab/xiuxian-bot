import { Text, useParse, useSend } from 'alemonjs'
import { ControlByBlood, isUser, victoryCooling } from 'xiuxian-api'
import { Boss, Fight, operationLock } from 'xiuxian-core'
import { Redis, user } from 'xiuxian-db'
// 攻击
export default OnResponse(
  async e => {
    const UID = e.UserId

    // lock start
    const T = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }

    // 检查活动时间
    // if (!Boss.isBossActivityOpen()) {
    //   Send(Text('BOSS已经逃跑....'))
    //   return
    // }

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    // 血量不足
    if (!(await ControlByBlood(e, UserData))) return

    const text = useParse(e.Megs, 'Text')
    let key: '1' | '2' = '1'
    if (/银角/.test(text)) {
      key = '2'
    }

    //
    const lock = await Redis.get(`lock:boss:lock:${key}`)
    if (lock && Date.now() - Number(lock) < 6 * 1000) {
      Send(Text('怪物躲过了你的攻击...'))
      return
    }

    // 一定时间解锁
    await Redis.set('lock:boss', Date.now())

    //
    const CDID = 10
    if (!(await victoryCooling(e, UID, CDID))) return

    // 查看boss信息
    const bossInfo = await Boss.getBossData(key)
    // 如果没有boss信息,则创建
    if (!bossInfo) {
      Send(Text('BOSS正在降临...'))
      Boss.updateBossData(key)
      return
    }

    //
    try {
      const Now = new Date()

      // 如果创建时间超过2h,则重新创建
      if (Now.getTime() - bossInfo.createAt > 12 * 60 * 60 * 1000) {
        Send(Text('BOSS已经逃跑....'))
        Boss.updateBossData(key)
        return
      }

      // 怪物没有那么多的字段
      const BMSG = Fight.startBoss(UserData, bossInfo.data)

      // 更新怪物数据
      await Boss.setBossData(key, {
        createAt: bossInfo.createAt,
        level: bossInfo.level,
        data: {
          ...bossInfo.data,
          battle_blood_now: BMSG.battle_blood_now.b
        }
      })

      // 更新玩家数据
      await user.update(
        {
          battle_blood_now: BMSG.battle_blood_now.a
        },
        {
          where: {
            uid: UID
          }
        }
      )

      // 释放lock
      await Redis.del(`lock:boss:lock:${key}`)

      Send(Text(BMSG.msg.join('\n')))
    } catch (e) {
      console.error(e)
      Send(Text('BOSS信息异常'))
    }
  },
  'message.create',
  /^(#|\/)?攻击(金角|银角)/
)
