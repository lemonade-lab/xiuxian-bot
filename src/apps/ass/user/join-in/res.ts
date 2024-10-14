import { Text, useParse, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
import * as GameApi from '@xiuxian/core/index'
import * as DB from '@xiuxian/db/index'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    // 查看自己的势力
    const UserAss = await DB.user_ass
      .findOne({
        where: {
          uid: UID,
          identity: GameApi.Config.ASS_IDENTITY_MAP['0']
        }
      })
      .then(res => res?.dataValues)

    //
    const Send = useSend(e)

    //
    if (UserAss) {
      Send(Text('已创立个人势力'))
      return
    }

    const text = useParse(e.Megs, 'Text')

    // 加入xxx
    const name = text.replace(/^(#|\/)?加入/, '')

    // 存在该昵称的宗门
    const aData = await DB.ass
      .findOne({
        where: {
          name: name
        }
      })
      .then(res => res?.dataValues)

    //
    if (!aData) {
      Send(Text('该势力不存在'))
      return
    }

    // 检测是否已提交申请
    const joinData = await DB.user_ass
      .findOne({
        where: {
          uid: UID,
          aid: aData.id,
          identity: GameApi.Config.ASS_IDENTITY_MAP['9']
        }
      })
      .then(res => res?.dataValues)

    if (joinData && joinData.identity == GameApi.Config.ASS_IDENTITY_MAP['9']) {
      Send(Text('请勿重复提交'))
      return
    }

    // 创建信息条目
    await DB.user_ass.create({
      create_tiime: Date.now(),
      uid: UID,
      aid: aData.id,
      // 9级权限
      authentication: 9,
      identity: GameApi.Config.ASS_IDENTITY_MAP['9']
    })

    //
    Send(Text('已提交申请'))

    return
  },
  'message.create',
  /^(#|\/)?加入[\u4e00-\u9fa5]+$/
)
