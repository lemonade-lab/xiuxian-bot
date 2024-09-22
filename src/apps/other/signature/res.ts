import { Text, useParse, useSend } from 'alemonjs'
import { Control, showUserMsg, victoryCooling, isUser } from 'xiuxian-api'
import { Config } from 'xiuxian-core'
import * as GameApi from 'xiuxian-core'
import { user } from 'xiuxian-db'
export default OnResponse(
  async e => {
    //
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    if (!(await Control(e, UserData))) return

    // 解析文本
    const text = useParse(e.Megs, 'Text')
    const autograph = text.replace(/^(#|\/)?签名/, '')

    // 发送消息
    const Send = useSend(e)

    // 非法字符
    if (Config.IllegalCharacters.test(autograph)) {
      Send(Text('异常签名'))
      return
    }
    // 长度限制
    if (autograph.length == 0 || autograph.length > 50) {
      Send(Text('请正确设置\n且道宣最多50字符'))
      return
    }
    const CDID = 4
    const CDTime = GameApi.Cooling.CD_Autograph
    if (!(await victoryCooling(e, UID, CDID))) return
    GameApi.Burial.set(UID, CDID, CDTime)
    // 更新用户
    await user.update(
      { autograph: autograph },
      {
        where: {
          uid: UID
        }
      }
    )
    //
    setTimeout(() => {
      showUserMsg(e)
    }, 500)
    return
  },
  'message.create',
  /^(#|\/)?签名[\u4e00-\u9fa5]+$/
)
