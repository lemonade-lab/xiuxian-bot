import { Text, useParse, useSend } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import * as DB from 'xiuxian-db'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    // 境界拦截
    const gaspractice = await DB.user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 1
        }
      })
      .then(res => res?.dataValues)
      .then(res => res.realm)

    const Send = useSend(e)
    if (gaspractice <= GameApi.Cooling.AssLevel) {
      Send(Text('境界不足'))
      return false
    }

    // 已拥有查询
    const UserAss = await DB.user_ass
      .findOne({
        where: {
          uid: UID,
          identity: GameApi.Config.ASS_IDENTITY_MAP['0']
        }
      })
      .then(res => res?.dataValues)

    //
    if (UserAss) {
      Send(Text('已创立个人势力'))
      return
    }

    const text = useParse(e.Megs, 'Text')
    const NAME = text.replace(/^(#|\/)?建立/, '')
    const typing = NAME.match(/.$/)[0]

    if (
      !Object.prototype.hasOwnProperty.call(
        GameApi.Config.ASS_TYPING_MAP,
        typing
      )
    ) {
      Send(
        Text(
          [
            '该类型势力不可建立:',
            typing,
            '\n仅可建立(宗|派|门|峰|教|谷|洞|阁|组|堡|城|宫|国|会)'
          ].join('')
        )
      )
      return
    }

    /**
     * ********
     * 存在该昵称的宗门
     */
    const aData = await DB.ass
      .findOne({
        where: {
          name: NAME
        }
      })
      .then(res => res?.dataValues)
    if (aData) {
      Send(Text('该势力已存在'))
      return
    }

    /**
     * ************
     * 灵石拦截
     */
    const lingshi = await GameApi.Bag.searchBagByName(UID, '下品灵石')

    const number = GameApi.Cooling.AssNumer

    // // 灵石不够
    if (!lingshi || lingshi.acount < number) {
      Send(Text(`\n需要确保拥有[下品灵石]*${number}`))

      return
    } else {
      Send(Text(`扣除[下品灵石]*${number}`))
    }

    /**
     * ********
     * 扣除灵石
     */
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: number
      }
    ])

    /**
     * *********
     * 创建势力
     */
    await DB.ass
      .create({
        create_time: new Date().getTime(),
        name: NAME,
        property: number, // 储蓄
        typing: GameApi.Config.ASS_TYPING_MAP[typing] // 类型
      })
      .then(async () => {
        const aData = await DB.ass
          .findOne({
            where: {
              name: NAME
            }
          })
          .then(res => res?.dataValues)
        if (!aData) {
          Send(Text(`创建失败`))

          return
        }
        // 创建存档
        await DB.user_ass.create({
          create_tiime: new Date().getTime(),
          uid: UID,
          aid: aData.id, // 并不知道id
          authentication: 0,
          identity: GameApi.Config.ASS_IDENTITY_MAP['0']
        })
        Send(Text(`成功建立`))
      })

    return
  },
  'message.create',
  /^(#|\/)?建立[\u4e00-\u9fa5]+$/
)
