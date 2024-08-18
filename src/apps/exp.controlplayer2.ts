import { Messages } from 'alemonjs'
import { isThereAUserPresent, endAllWord } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?(锻体|降妖)$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  if (UserData.state == 2) {
    e.reply('锻体中...', {
      quote: e.msg_id
    })
    return
  }
  if (UserData.state == 1 || UserData.state == 8) {
    //调用计算
    await endAllWord(e, UID, UserData)
  }
  // 其他状态
  const { state, msg } = await GameApi.State.Go(UserData)
  if (state == 4001) {
    e.reply(msg)
    return
  }
  setTimeout(async () => {
    await GameApi.State.set(UID, {
      actionID: 2,
      startTime: new Date().getTime(), // 记录了现在的时间
      endTime: 9999999999999
    })
    e.reply(['开始爬山越岭,负重前行...'], {
      quote: e.msg_id
    })
  }, 2000)
  return
})
