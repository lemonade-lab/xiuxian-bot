import { Messages } from 'alemonjs'
import { isThereAUserPresent, endAllWord } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { user } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?打坐$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)
  // 已经是打坐了
  if (UserData.state == 8) {
    e.reply('打坐中...', {
      quote: e.msg_id
    })
    return
  }
  // 如果是 闭关 和 降妖
  if (UserData.state == 1 || UserData.state == 2) {
    // 调用计算
    await endAllWord(e, UID, UserData)
  }
  // 没有调用计算,而是其他行为
  const { state, msg } = await GameApi.State.Go(UserData)
  if (state == 4001) {
    e.reply(msg)
    return
  }
  // 切换为打坐
  setTimeout(async () => {
    await GameApi.State.set(UID, {
      actionID: 8,
      startTime: new Date().getTime(), // 记录了现在的时间
      endTime: 9999999999999
    })
    e.reply(['开始吐纳灵气...'], {
      quote: e.msg_id
    })
  }, 2000)
  return
})
