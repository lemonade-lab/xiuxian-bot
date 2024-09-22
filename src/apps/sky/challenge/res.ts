import { isUser, sendReply, victoryCooling } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    // lock start
    const T = await GameApi.operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }

    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const CDID = 23
    const CDTime = GameApi.Cooling.CD_B
    if (!(await victoryCooling(e, UID, CDID))) return
    // 查看数据是否存在
    const data = await DB.sky
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)

    if (!data) {
      Send(Text('😃未进入'))
      return
    }

    const text = useParse(e.Megs, 'Text')

    const id = Number(text.replace(/^(#|\/)?挑战/, ''))
    if (id >= data.id || id < 1) {
      Send(Text('😅你干嘛'))

      return
    }
    // 设置redis
    GameApi.Burial.set(UID, CDID, CDTime)
    const dataB = await DB.sky
      .findOne({
        where: {
          id: id
        }
      })
      .then(res => res?.dataValues)
    // 如果发现找不到。就说明位置是空的，占领位置。
    if (!dataB) {
      await DB.sky.update(
        {
          id
        },
        {
          where: {
            uid: data.uid
          }
        }
      )
      Send(Text('位置占领成功'))
      return
    }
    const UserDataB = await DB.user
      .findOne({
        where: {
          uid: dataB.uid
        }
      })
      .then(res => res?.dataValues)
    if (!UserDataB) {
      // 不存在该用户了
      await DB.sky.update(
        {
          id
        },
        {
          where: {
            uid: data.uid
          }
        }
      )
      Send(Text('位置占领成功'))
      return
    }

    const BMSG = GameApi.Fight.start(UserData, UserDataB)
    // 是否显示战斗结果
    if (UserData.battle_show || UserDataB.battle_show) {
      // 切割战斗信息
      sendReply(e, '[战斗结果]', BMSG.msg)
    }
    if (BMSG.victory == '0') {
      Send(Text('🤪挑战失败,你与对方打成了平手'))
      // 反馈战斗信息

      return
    }
    if (BMSG.victory != UID) {
      Send(Text('🤪挑战失败,你被对方击败了'))

      return
    }
    //
    await DB.sky.update(
      {
        // 自身的 uid
        uid: data.uid
      },
      {
        where: {
          // 目标 id
          id: dataB.id
        }
      }
    )
    //
    await DB.sky.update(
      {
        // 对方的
        uid: dataB.uid
      },
      {
        where: {
          // 自身的 id
          id: data.id
        }
      }
    )
    //
    Send(Text(`😶挑战成功,当前排名${id}`))
  },
  'message.create',
  /^(#|\/)?挑战\d+$/
)
