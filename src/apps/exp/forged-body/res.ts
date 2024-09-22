import { Text, useSend } from 'alemonjs'
import { isUser, endAllWord } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const Send = useSend(e)
    if (UserData.state == 2) {
      Send(Text('锻体中...'))
      return
    }
    if (UserData.state == 1 || UserData.state == 8) {
      //调用计算
      await endAllWord(e, UID, UserData)
    }
    // 其他状态
    const { state, msg } = await GameApi.State.Go(UserData)
    if (state == 4001) {
      Send(Text(msg))
      return
    }
    setTimeout(async () => {
      await GameApi.State.set(UID, {
        actionID: 2,
        startTime: new Date().getTime(), // 记录了现在的时间
        endTime: 9999999999999
      })
      Send(Text('开始爬山越岭,负重前行...'))
    }, 2000)
    return
  },
  'message.create',
  /^(#|\/)?(锻体|降妖)$/
)
