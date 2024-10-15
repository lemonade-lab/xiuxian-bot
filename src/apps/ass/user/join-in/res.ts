import { Text, useParse, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
import * as GameApi from '@xiuxian/core/index'
import * as DB from '@xiuxian/db/index'
import { AssGradesSize } from '@src/xiuxian/core/src/config/cooling'
import { Op } from 'sequelize'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    // 查看自己的势力
    const UserAss = await DB.user_ass
      .findAll({
        where: {
          uid: UID,
          identity: GameApi.Config.ASS_IDENTITY_MAP['0']
        }
      })
      .then(res => res.map(res => res?.dataValues))

    //
    const Send = useSend(e)

    const myAss = UserAss.find(
      item => item.identity == GameApi.Config.ASS_IDENTITY_MAP['0']
    )
    //
    if (myAss) {
      Send(Text('已创立个人势力'))
      return
    }

    if (UserAss.length > 3) {
      Send(Text('最多申请三家势力'))
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

    // 查看人数
    const count = await DB.user_ass.count({
      where: {
        aid: aData.id,
        // 排除
        identity: { [Op.ne]: GameApi.Config.ASS_IDENTITY_MAP['9'] }
      }
    })

    // 限制
    const size = AssGradesSize[aData.grade]

    if (!size || count >= size) {
      Send(Text('人数已达上限'))
      return
    }

    // 创建信息条目
    await DB.user_ass.create({
      create_tiime: Date.now(),
      uid: UID,
      aid: aData.id,
      // 9级权限（最低）
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
