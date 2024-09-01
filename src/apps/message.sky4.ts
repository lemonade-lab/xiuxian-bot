import { Messages } from 'alemonjs'
import { isUser, sendReply, victoryCooling } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?挑战\d+$/, async e => {
  /**
   * *******
   * lock start
   * *******
   */
  const T = await operationLock(e.user_id)
  if (!T) {
    e.reply('操作频繁')
    return
  }
  /**
   * lock end
   */

  const UID = e.user_id

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
    e.reply('😃未进入', {
      quote: e.msg_id
    })
    return
  }
  const id = Number(e.msg.replace(/^(#|\/)?挑战/, ''))
  if (id >= data.id || id < 1) {
    e.reply('😅你干嘛', {
      quote: e.msg_id
    })
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
    e.reply('位置占领成功')
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
    e.reply('位置占领成功')
    return
  }

  const BMSG = GameApi.Fight.start(UserData, UserDataB)
  // 是否显示战斗结果
  if (UserData.battle_show || UserDataB.battle_show) {
    // 切割战斗信息
    sendReply(e, '[战斗结果]', BMSG.msg)
  }
  if (BMSG.victory == '0') {
    // 反馈战斗信息
    e.reply('🤪挑战失败,你与对方打成了平手', {
      quote: e.msg_id
    })
    return
  }
  if (BMSG.victory != UID) {
    // 反馈战斗信息
    e.reply('🤪挑战失败,你被对方击败了', {
      quote: e.msg_id
    })
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
  e.reply(`😶挑战成功,当前排名${id}`, {
    quote: e.msg_id
  })
})
