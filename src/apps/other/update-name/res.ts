import { Text, useParse, useSend } from 'alemonjs'
import {
  Control,
  showUserMsg,
  victoryCooling,
  isUser
} from '@xiuxian/api/index'
import { Config } from '@xiuxian/core/index'
import * as GameApi from '@xiuxian/core/index'
import { user } from '@xiuxian/db/index'
export default OnResponse(
  async e => {
    //
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    if (!(await Control(e, UserData))) return
    const text = useParse(e.Megs, 'Text')
    const name = text.replace(/^(#|\/)?(改名|(更改|更换)道號)/, '')
    const Send = useSend(e)
    if (Config.IllegalCharacters.test(name)) {
      Send(Text('异常名称'))
      return
    }
    if (name.length == 0) return
    if (name.length > 8) {
      Send(Text('请正确设置\n且道宣最多8字符'))
      return
    }
    const CDID = 3
    const CDTime = GameApi.Cooling.CD_Name
    if (!(await victoryCooling(e, UID, CDID))) return
    GameApi.Burial.set(UID, CDID, CDTime)
    //
    await user.update(
      {
        name: name
      },
      {
        where: {
          uid: UID
        }
      }
    )
    setTimeout(() => {
      showUserMsg(e)
    }, 500)
    return
  },
  'message.create',
  /^(#|\/)?(改名|(更改|更换)道號)[\u4e00-\u9fa5]+$/
)
