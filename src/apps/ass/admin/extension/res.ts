import { isUser } from '@xiuxian/api/index'
import * as DB from '@xiuxian/db/index'
import * as GameApi from '@xiuxian/core/index'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const text = useParse(e.Megs, 'Text')

    const name = text.replace(/^(#|\/)?升级/, '')

    // tudo 有错误
    const aData = await DB.ass
      .findOne({
        where: {
          name: name
        }
      })
      .then(res => res?.dataValues)
      .catch(err => console.error(err))

    const Send = useSend(e)

    // 不存在
    if (!aData) {
      console.log('势力不存在', aData)
      return false
    }

    //
    const UserAss = await DB.user_ass
      .findOne({
        where: {
          uid: UID, // uid
          aid: aData.id
        }
      })
      .then(res => res?.dataValues)

    // 不存在，或者 9
    if (!UserAss || UserAss?.authentication == 9) {
      Send(Text('不属于该宗门'))
      return
    }

    // 大于4
    if (UserAss.authentication >= 4) {
      Send(Text('权能不足'))
      return
    }

    //
    if (aData.grade > 4) {
      Send(Text('宗门等级已达最高'))
      return
    }

    //
    const goods = await GameApi.Bag.searchBagByName(UID, '开天令')

    //
    const num = GameApi.Cooling.upgradeass[aData.grade]

    //
    if (!goods) {
      Send(Text('你没有开天令'))
      return
    }

    //
    if (goods.acount < num) {
      Send(Text('开天令不足'))
      return
    }

    //
    GameApi.Bag.reduceBagThing(UID, [{ name: '开天令', acount: num }])

    //
    await DB.ass.update(
      { grade: aData.grade + 1 },
      {
        where: {
          id: aData.id
        }
      }
    )

    Send(Text('升级成功'))

    return
  },
  'message.create',
  /^(#|\/)?升级[\u4e00-\u9fa5]+$/
)
