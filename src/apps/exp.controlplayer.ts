import { Messages } from 'alemonjs'
import { isThereAUserPresent, endAllWord } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?(闭关|閉關)$/, async e => {
  const UID = e.user_id
  //
  if (!(await isThereAUserPresent(e, UID))) return
  //
  const UserData = await GameApi.Users.read(UID)
  // 已经是闭关了
  if (UserData.state == 1) {
    e.reply('闭关中...', {
      quote: e.msg_id
    })
    return
  }
  // 锻体2 聚灵3
  if (UserData.state == 2 || UserData.state == 8) {
    //调用计算
    await endAllWord(e, UID, UserData)
  }
  // 没有调用计算,而是其他行为
  const { state, msg } = await GameApi.State.Go(UserData)
  if (state == 4001) {
    e.reply(msg)
    return
  }
  setTimeout(async () => {
    await GameApi.State.set(UID, {
      actionID: 1,
      startTime: new Date().getTime(), // 记录了现在的时间
      endTime: 9999999999999 // 结束时间应该是无限的
    })
    e.reply(['开始两耳不闻窗外事...'], {
      quote: e.msg_id
    })
  }, 2000)
  return
})
