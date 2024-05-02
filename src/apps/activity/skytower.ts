import { APlugin, ClientNTQQ, Controllers, type AEvent } from 'alemonjs'
import {
  DB,
  GameApi,
  isThereAUserPresent,
  sendReply,
  victoryCooling,
  activityCooling,
  Server,
  getSkyComponent,
  postHelp
} from '../../api/index.js'

export class SkyTower extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?进入通天塔$/,
          fnc: 'join'
        },
        {
          reg: /^(#|\/)?通天塔$/,
          fnc: 'showSky'
        },
        {
          reg: /^(#|\/)?挑战\d+$/,
          fnc: 'battle'
        }
      ]
    })
  }

  /**
   * 进入通天塔
   * @param e
   * @returns
   */
  async join(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    if (!(await activityCooling(e, UID, '通天塔'))) return

    /**
     * 查看数据是否存在
     */
    const data: DB.SkyType = (await DB.sky.findOne({
      where: {
        uid: UID
      },
      raw: true
    })) as any

    if (data) {
      e.reply('已进入', {
        quote: e.msg_id
      })
      postHelp(e,"[{\"group\":\"通天塔\",\"list\":[{\"icon\":22,\"title\":\"/进入通天塔\",\"desc\":\"凝聚灵魂化身\"},{\"icon\":22,\"title\":\"/通天塔\",\"desc\":\"查看排名\"},{\"icon\":22,\"title\":\"/挑战+排名\",\"desc\":\"所向披靡\"}]},{\"group\":\"提升战力\",\"list\":[{\"icon\":14,\"title\":\"/闭关\",\"desc\":\"进行闭关\"},{\"icon\":14,\"title\":\"/出关\",\"desc\":\"增加修为\"},{\"icon\":21,\"title\":\"/锻体\",\"desc\":\"进行锻体\"},{\"icon\":21,\"title\":\"/凝脉\",\"desc\":\"锻炼气血\"},{\"icon\":21,\"title\":\"/打坐\",\"desc\":\"聚集灵气\"},{\"icon\":21,\"title\":\"/聚灵\",\"desc\":\"凝聚体内\"},{\"icon\":8,\"title\":\"/炼化+物品名\",\"desc\":\"炼化物品未本命物\"},{\"icon\":8,\"title\":\"/精炼\",\"desc\":\"强化本命物\"},{\"icon\":8,\"title\":\"/突破\",\"desc\":\"练气升级\"},{\"icon\":8,\"title\":\"/破境\",\"desc\":\"练体升级\"}]},{\"group\":\"其它\",\"list\":[{\"icon\":16,\"title\":\"/战斗帮助\",\"desc\":\"战斗系统\"},{\"icon\":16,\"title\":\"/地图帮助\",\"desc\":\"地图系统\"},{\"icon\":16,\"title\":\"/联盟帮助\",\"desc\":\"联盟系统\"},{\"icon\":8,\"title\":\"/黑市帮助\",\"desc\":\"交易系统\"},{\"icon\":16,\"title\":\"/修炼帮助\",\"desc\":\"修炼系统\"},{\"icon\":16,\"title\":\"/职业帮助\",\"desc\":\"职业系统\"},{\"icon\":16,\"title\":\"/势力帮助\",\"desc\":\"势力系统\"}]}]")
      return
    }

    // 查看奖励
    e.reply(['进入[通天塔]'], {
      quote: e.msg_id
    })
    postHelp(e,"[{\"group\":\"通天塔\",\"list\":[{\"icon\":22,\"title\":\"/进入通天塔\",\"desc\":\"凝聚灵魂化身\"},{\"icon\":22,\"title\":\"/通天塔\",\"desc\":\"查看排名\"},{\"icon\":22,\"title\":\"/挑战+排名\",\"desc\":\"所向披靡\"}]},{\"group\":\"提升战力\",\"list\":[{\"icon\":14,\"title\":\"/闭关\",\"desc\":\"进行闭关\"},{\"icon\":14,\"title\":\"/出关\",\"desc\":\"增加修为\"},{\"icon\":21,\"title\":\"/锻体\",\"desc\":\"进行锻体\"},{\"icon\":21,\"title\":\"/凝脉\",\"desc\":\"锻炼气血\"},{\"icon\":21,\"title\":\"/打坐\",\"desc\":\"聚集灵气\"},{\"icon\":21,\"title\":\"/聚灵\",\"desc\":\"凝聚体内\"},{\"icon\":8,\"title\":\"/炼化+物品名\",\"desc\":\"炼化物品未本命物\"},{\"icon\":8,\"title\":\"/精炼\",\"desc\":\"强化本命物\"},{\"icon\":8,\"title\":\"/突破\",\"desc\":\"练气升级\"},{\"icon\":8,\"title\":\"/破境\",\"desc\":\"练体升级\"}]},{\"group\":\"其它\",\"list\":[{\"icon\":16,\"title\":\"/战斗帮助\",\"desc\":\"战斗系统\"},{\"icon\":16,\"title\":\"/地图帮助\",\"desc\":\"地图系统\"},{\"icon\":16,\"title\":\"/联盟帮助\",\"desc\":\"联盟系统\"},{\"icon\":8,\"title\":\"/黑市帮助\",\"desc\":\"交易系统\"},{\"icon\":16,\"title\":\"/修炼帮助\",\"desc\":\"修炼系统\"},{\"icon\":16,\"title\":\"/职业帮助\",\"desc\":\"职业系统\"},{\"icon\":16,\"title\":\"/势力帮助\",\"desc\":\"势力系统\"}]}]")
    Controllers(e).Message.reply('', [
      { label: '挑战', value: '/挑战', enter: false },
      { label: '控制板', value: '/控制板' }
    ])

    await DB.sky.create({
      uid: UID
    } as DB.SkyType)

    return
  }

  /**
   * 通天塔
   * @param e
   * @returns
   */
  async showSky(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    if (!(await activityCooling(e, UID, '通天塔'))) return
    /**
     * 查看数据是否存在
     */
    const data: DB.SkyType = (await DB.sky.findOne({
      where: {
        uid: UID
      },
      raw: true
    })) as any

    if (!data) {
      e.reply('未进入', {
        quote: e.msg_id
      })
      postHelp(e,"[{\"group\":\"通天塔\",\"list\":[{\"icon\":22,\"title\":\"/进入通天塔\",\"desc\":\"凝聚灵魂化身\"},{\"icon\":22,\"title\":\"/通天塔\",\"desc\":\"查看排名\"},{\"icon\":22,\"title\":\"/挑战+排名\",\"desc\":\"所向披靡\"}]},{\"group\":\"提升战力\",\"list\":[{\"icon\":14,\"title\":\"/闭关\",\"desc\":\"进行闭关\"},{\"icon\":14,\"title\":\"/出关\",\"desc\":\"增加修为\"},{\"icon\":21,\"title\":\"/锻体\",\"desc\":\"进行锻体\"},{\"icon\":21,\"title\":\"/凝脉\",\"desc\":\"锻炼气血\"},{\"icon\":21,\"title\":\"/打坐\",\"desc\":\"聚集灵气\"},{\"icon\":21,\"title\":\"/聚灵\",\"desc\":\"凝聚体内\"},{\"icon\":8,\"title\":\"/炼化+物品名\",\"desc\":\"炼化物品未本命物\"},{\"icon\":8,\"title\":\"/精炼\",\"desc\":\"强化本命物\"},{\"icon\":8,\"title\":\"/突破\",\"desc\":\"练气升级\"},{\"icon\":8,\"title\":\"/破境\",\"desc\":\"练体升级\"}]},{\"group\":\"其它\",\"list\":[{\"icon\":16,\"title\":\"/战斗帮助\",\"desc\":\"战斗系统\"},{\"icon\":16,\"title\":\"/地图帮助\",\"desc\":\"地图系统\"},{\"icon\":16,\"title\":\"/联盟帮助\",\"desc\":\"联盟系统\"},{\"icon\":8,\"title\":\"/黑市帮助\",\"desc\":\"交易系统\"},{\"icon\":16,\"title\":\"/修炼帮助\",\"desc\":\"修炼系统\"},{\"icon\":16,\"title\":\"/职业帮助\",\"desc\":\"职业系统\"},{\"icon\":16,\"title\":\"/势力帮助\",\"desc\":\"势力系统\"}]}]")
      return
    }
    const img = await getSkyComponent(await Server.showSky(UID), UID)
    if (typeof img != 'boolean') {
      e.reply(img)
      postHelp(e,"[{\"group\":\"通天塔\",\"list\":[{\"icon\":22,\"title\":\"/进入通天塔\",\"desc\":\"凝聚灵魂化身\"},{\"icon\":22,\"title\":\"/通天塔\",\"desc\":\"查看排名\"},{\"icon\":22,\"title\":\"/挑战+排名\",\"desc\":\"所向披靡\"}]},{\"group\":\"提升战力\",\"list\":[{\"icon\":14,\"title\":\"/闭关\",\"desc\":\"进行闭关\"},{\"icon\":14,\"title\":\"/出关\",\"desc\":\"增加修为\"},{\"icon\":21,\"title\":\"/锻体\",\"desc\":\"进行锻体\"},{\"icon\":21,\"title\":\"/凝脉\",\"desc\":\"锻炼气血\"},{\"icon\":21,\"title\":\"/打坐\",\"desc\":\"聚集灵气\"},{\"icon\":21,\"title\":\"/聚灵\",\"desc\":\"凝聚体内\"},{\"icon\":8,\"title\":\"/炼化+物品名\",\"desc\":\"炼化物品未本命物\"},{\"icon\":8,\"title\":\"/精炼\",\"desc\":\"强化本命物\"},{\"icon\":8,\"title\":\"/突破\",\"desc\":\"练气升级\"},{\"icon\":8,\"title\":\"/破境\",\"desc\":\"练体升级\"}]},{\"group\":\"其它\",\"list\":[{\"icon\":16,\"title\":\"/战斗帮助\",\"desc\":\"战斗系统\"},{\"icon\":16,\"title\":\"/地图帮助\",\"desc\":\"地图系统\"},{\"icon\":16,\"title\":\"/联盟帮助\",\"desc\":\"联盟系统\"},{\"icon\":8,\"title\":\"/黑市帮助\",\"desc\":\"交易系统\"},{\"icon\":16,\"title\":\"/修炼帮助\",\"desc\":\"修炼系统\"},{\"icon\":16,\"title\":\"/职业帮助\",\"desc\":\"职业系统\"},{\"icon\":16,\"title\":\"/势力帮助\",\"desc\":\"势力系统\"}]}]")
      Controllers(e).Message.reply('', [
        { label: '挑战', value: '/挑战', enter: false },
        { label: '控制板', value: '/控制板' }
      ])
    }
    return
  }

  /**
   * 挑战
   * @param e
   * @returns
   */
  async battle(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    if (!(await activityCooling(e, UID, '通天塔'))) return

    const CDID = 23,
      CDTime = GameApi.Cooling.CD_B
    if (!(await victoryCooling(e, UID, CDID))) return

    /**
     * 查看数据是否存在
     */
    const data: DB.SkyType = (await DB.sky.findOne({
      where: {
        uid: UID
      },
      raw: true
    })) as any

    if (!data) {
      e.reply('😃未进入', {
        quote: e.msg_id
      })
      postHelp(e,"[{\"group\":\"通天塔\",\"list\":[{\"icon\":22,\"title\":\"/进入通天塔\",\"desc\":\"凝聚灵魂化身\"},{\"icon\":22,\"title\":\"/通天塔\",\"desc\":\"查看排名\"},{\"icon\":22,\"title\":\"/挑战+排名\",\"desc\":\"所向披靡\"}]},{\"group\":\"提升战力\",\"list\":[{\"icon\":14,\"title\":\"/闭关\",\"desc\":\"进行闭关\"},{\"icon\":14,\"title\":\"/出关\",\"desc\":\"增加修为\"},{\"icon\":21,\"title\":\"/锻体\",\"desc\":\"进行锻体\"},{\"icon\":21,\"title\":\"/凝脉\",\"desc\":\"锻炼气血\"},{\"icon\":21,\"title\":\"/打坐\",\"desc\":\"聚集灵气\"},{\"icon\":21,\"title\":\"/聚灵\",\"desc\":\"凝聚体内\"},{\"icon\":8,\"title\":\"/炼化+物品名\",\"desc\":\"炼化物品未本命物\"},{\"icon\":8,\"title\":\"/精炼\",\"desc\":\"强化本命物\"},{\"icon\":8,\"title\":\"/突破\",\"desc\":\"练气升级\"},{\"icon\":8,\"title\":\"/破境\",\"desc\":\"练体升级\"}]},{\"group\":\"其它\",\"list\":[{\"icon\":16,\"title\":\"/战斗帮助\",\"desc\":\"战斗系统\"},{\"icon\":16,\"title\":\"/地图帮助\",\"desc\":\"地图系统\"},{\"icon\":16,\"title\":\"/联盟帮助\",\"desc\":\"联盟系统\"},{\"icon\":8,\"title\":\"/黑市帮助\",\"desc\":\"交易系统\"},{\"icon\":16,\"title\":\"/修炼帮助\",\"desc\":\"修炼系统\"},{\"icon\":16,\"title\":\"/职业帮助\",\"desc\":\"职业系统\"},{\"icon\":16,\"title\":\"/势力帮助\",\"desc\":\"势力系统\"}]}]")
      return
    }

    const id = Number(e.msg.replace(/^(#|\/)?挑战/, ''))
    if (id >= data.id || id < 1) {
      e.reply('😅你干嘛', {
        quote: e.msg_id
      })
      postHelp(e,"[{\"group\":\"通天塔\",\"list\":[{\"icon\":22,\"title\":\"/进入通天塔\",\"desc\":\"凝聚灵魂化身\"},{\"icon\":22,\"title\":\"/通天塔\",\"desc\":\"查看排名\"},{\"icon\":22,\"title\":\"/挑战+排名\",\"desc\":\"所向披靡\"}]},{\"group\":\"提升战力\",\"list\":[{\"icon\":14,\"title\":\"/闭关\",\"desc\":\"进行闭关\"},{\"icon\":14,\"title\":\"/出关\",\"desc\":\"增加修为\"},{\"icon\":21,\"title\":\"/锻体\",\"desc\":\"进行锻体\"},{\"icon\":21,\"title\":\"/凝脉\",\"desc\":\"锻炼气血\"},{\"icon\":21,\"title\":\"/打坐\",\"desc\":\"聚集灵气\"},{\"icon\":21,\"title\":\"/聚灵\",\"desc\":\"凝聚体内\"},{\"icon\":8,\"title\":\"/炼化+物品名\",\"desc\":\"炼化物品未本命物\"},{\"icon\":8,\"title\":\"/精炼\",\"desc\":\"强化本命物\"},{\"icon\":8,\"title\":\"/突破\",\"desc\":\"练气升级\"},{\"icon\":8,\"title\":\"/破境\",\"desc\":\"练体升级\"}]},{\"group\":\"其它\",\"list\":[{\"icon\":16,\"title\":\"/战斗帮助\",\"desc\":\"战斗系统\"},{\"icon\":16,\"title\":\"/地图帮助\",\"desc\":\"地图系统\"},{\"icon\":16,\"title\":\"/联盟帮助\",\"desc\":\"联盟系统\"},{\"icon\":8,\"title\":\"/黑市帮助\",\"desc\":\"交易系统\"},{\"icon\":16,\"title\":\"/修炼帮助\",\"desc\":\"修炼系统\"},{\"icon\":16,\"title\":\"/职业帮助\",\"desc\":\"职业系统\"},{\"icon\":16,\"title\":\"/势力帮助\",\"desc\":\"势力系统\"}]}]")
      return
    }

    // 设置redis
    GameApi.Burial.set(UID, CDID, CDTime)

    const dataB: DB.SkyType = (await DB.sky.findOne({
      where: {
        id: id
      },
      raw: true
    })) as any

    // 如果发现找不到。就说明位置是空的，占领位置。
    if (!dataB) {
      await DB.sky.update(
        {
          id
        },
        {
          where: {
            uid: data.uid
          }
        }
      )
      e.reply('位置占领成功')
      postHelp(e,"[{\"group\":\"通天塔\",\"list\":[{\"icon\":22,\"title\":\"/进入通天塔\",\"desc\":\"凝聚灵魂化身\"},{\"icon\":22,\"title\":\"/通天塔\",\"desc\":\"查看排名\"},{\"icon\":22,\"title\":\"/挑战+排名\",\"desc\":\"所向披靡\"}]},{\"group\":\"提升战力\",\"list\":[{\"icon\":14,\"title\":\"/闭关\",\"desc\":\"进行闭关\"},{\"icon\":14,\"title\":\"/出关\",\"desc\":\"增加修为\"},{\"icon\":21,\"title\":\"/锻体\",\"desc\":\"进行锻体\"},{\"icon\":21,\"title\":\"/凝脉\",\"desc\":\"锻炼气血\"},{\"icon\":21,\"title\":\"/打坐\",\"desc\":\"聚集灵气\"},{\"icon\":21,\"title\":\"/聚灵\",\"desc\":\"凝聚体内\"},{\"icon\":8,\"title\":\"/炼化+物品名\",\"desc\":\"炼化物品未本命物\"},{\"icon\":8,\"title\":\"/精炼\",\"desc\":\"强化本命物\"},{\"icon\":8,\"title\":\"/突破\",\"desc\":\"练气升级\"},{\"icon\":8,\"title\":\"/破境\",\"desc\":\"练体升级\"}]},{\"group\":\"其它\",\"list\":[{\"icon\":16,\"title\":\"/战斗帮助\",\"desc\":\"战斗系统\"},{\"icon\":16,\"title\":\"/地图帮助\",\"desc\":\"地图系统\"},{\"icon\":16,\"title\":\"/联盟帮助\",\"desc\":\"联盟系统\"},{\"icon\":8,\"title\":\"/黑市帮助\",\"desc\":\"交易系统\"},{\"icon\":16,\"title\":\"/修炼帮助\",\"desc\":\"修炼系统\"},{\"icon\":16,\"title\":\"/职业帮助\",\"desc\":\"职业系统\"},{\"icon\":16,\"title\":\"/势力帮助\",\"desc\":\"势力系统\"}]}]")
      return
    }

    const UserDataB: DB.UserType = (await DB.user.findOne({
      where: {
        uid: dataB.uid
      },
      raw: true
    })) as any

    if (!UserDataB) {
      // 不存在该用户了
      await DB.sky.update(
        {
          id
        },
        {
          where: {
            uid: data.uid
          }
        }
      )
      e.reply('位置占领成功')
      postHelp(e,"[{\"group\":\"通天塔\",\"list\":[{\"icon\":22,\"title\":\"/进入通天塔\",\"desc\":\"凝聚灵魂化身\"},{\"icon\":22,\"title\":\"/通天塔\",\"desc\":\"查看排名\"},{\"icon\":22,\"title\":\"/挑战+排名\",\"desc\":\"所向披靡\"}]},{\"group\":\"提升战力\",\"list\":[{\"icon\":14,\"title\":\"/闭关\",\"desc\":\"进行闭关\"},{\"icon\":14,\"title\":\"/出关\",\"desc\":\"增加修为\"},{\"icon\":21,\"title\":\"/锻体\",\"desc\":\"进行锻体\"},{\"icon\":21,\"title\":\"/凝脉\",\"desc\":\"锻炼气血\"},{\"icon\":21,\"title\":\"/打坐\",\"desc\":\"聚集灵气\"},{\"icon\":21,\"title\":\"/聚灵\",\"desc\":\"凝聚体内\"},{\"icon\":8,\"title\":\"/炼化+物品名\",\"desc\":\"炼化物品未本命物\"},{\"icon\":8,\"title\":\"/精炼\",\"desc\":\"强化本命物\"},{\"icon\":8,\"title\":\"/突破\",\"desc\":\"练气升级\"},{\"icon\":8,\"title\":\"/破境\",\"desc\":\"练体升级\"}]},{\"group\":\"其它\",\"list\":[{\"icon\":16,\"title\":\"/战斗帮助\",\"desc\":\"战斗系统\"},{\"icon\":16,\"title\":\"/地图帮助\",\"desc\":\"地图系统\"},{\"icon\":16,\"title\":\"/联盟帮助\",\"desc\":\"联盟系统\"},{\"icon\":8,\"title\":\"/黑市帮助\",\"desc\":\"交易系统\"},{\"icon\":16,\"title\":\"/修炼帮助\",\"desc\":\"修炼系统\"},{\"icon\":16,\"title\":\"/职业帮助\",\"desc\":\"职业系统\"},{\"icon\":16,\"title\":\"/势力帮助\",\"desc\":\"势力系统\"}]}]")
      return
    }

    const UserData: DB.UserType = (await DB.user.findOne({
      where: {
        uid: UID
      },
      raw: true
    })) as any

    const BMSG = GameApi.Fight.start(UserData, UserDataB)

    // 是否显示战斗结果
    if (UserData.battle_show || UserDataB.battle_show) {
      // 切割战斗信息
      sendReply(e, '[战斗结果]', BMSG.msg)
      postHelp(e,"[{\"group\":\"通天塔\",\"list\":[{\"icon\":22,\"title\":\"/进入通天塔\",\"desc\":\"凝聚灵魂化身\"},{\"icon\":22,\"title\":\"/通天塔\",\"desc\":\"查看排名\"},{\"icon\":22,\"title\":\"/挑战+排名\",\"desc\":\"所向披靡\"}]},{\"group\":\"提升战力\",\"list\":[{\"icon\":14,\"title\":\"/闭关\",\"desc\":\"进行闭关\"},{\"icon\":14,\"title\":\"/出关\",\"desc\":\"增加修为\"},{\"icon\":21,\"title\":\"/锻体\",\"desc\":\"进行锻体\"},{\"icon\":21,\"title\":\"/凝脉\",\"desc\":\"锻炼气血\"},{\"icon\":21,\"title\":\"/打坐\",\"desc\":\"聚集灵气\"},{\"icon\":21,\"title\":\"/聚灵\",\"desc\":\"凝聚体内\"},{\"icon\":8,\"title\":\"/炼化+物品名\",\"desc\":\"炼化物品未本命物\"},{\"icon\":8,\"title\":\"/精炼\",\"desc\":\"强化本命物\"},{\"icon\":8,\"title\":\"/突破\",\"desc\":\"练气升级\"},{\"icon\":8,\"title\":\"/破境\",\"desc\":\"练体升级\"}]},{\"group\":\"其它\",\"list\":[{\"icon\":16,\"title\":\"/战斗帮助\",\"desc\":\"战斗系统\"},{\"icon\":16,\"title\":\"/地图帮助\",\"desc\":\"地图系统\"},{\"icon\":16,\"title\":\"/联盟帮助\",\"desc\":\"联盟系统\"},{\"icon\":8,\"title\":\"/黑市帮助\",\"desc\":\"交易系统\"},{\"icon\":16,\"title\":\"/修炼帮助\",\"desc\":\"修炼系统\"},{\"icon\":16,\"title\":\"/职业帮助\",\"desc\":\"职业系统\"},{\"icon\":16,\"title\":\"/势力帮助\",\"desc\":\"势力系统\"}]}]")
    }

    if (BMSG.victory == '0') {
      /**
       * 反馈战斗信息
       */
      e.reply('🤪挑战失败,你与对方打成了平手', {
        quote: e.msg_id
      })
      postHelp(e,"[{\"group\":\"通天塔\",\"list\":[{\"icon\":22,\"title\":\"/进入通天塔\",\"desc\":\"凝聚灵魂化身\"},{\"icon\":22,\"title\":\"/通天塔\",\"desc\":\"查看排名\"},{\"icon\":22,\"title\":\"/挑战+排名\",\"desc\":\"所向披靡\"}]},{\"group\":\"提升战力\",\"list\":[{\"icon\":14,\"title\":\"/闭关\",\"desc\":\"进行闭关\"},{\"icon\":14,\"title\":\"/出关\",\"desc\":\"增加修为\"},{\"icon\":21,\"title\":\"/锻体\",\"desc\":\"进行锻体\"},{\"icon\":21,\"title\":\"/凝脉\",\"desc\":\"锻炼气血\"},{\"icon\":21,\"title\":\"/打坐\",\"desc\":\"聚集灵气\"},{\"icon\":21,\"title\":\"/聚灵\",\"desc\":\"凝聚体内\"},{\"icon\":8,\"title\":\"/炼化+物品名\",\"desc\":\"炼化物品未本命物\"},{\"icon\":8,\"title\":\"/精炼\",\"desc\":\"强化本命物\"},{\"icon\":8,\"title\":\"/突破\",\"desc\":\"练气升级\"},{\"icon\":8,\"title\":\"/破境\",\"desc\":\"练体升级\"}]},{\"group\":\"其它\",\"list\":[{\"icon\":16,\"title\":\"/战斗帮助\",\"desc\":\"战斗系统\"},{\"icon\":16,\"title\":\"/地图帮助\",\"desc\":\"地图系统\"},{\"icon\":16,\"title\":\"/联盟帮助\",\"desc\":\"联盟系统\"},{\"icon\":8,\"title\":\"/黑市帮助\",\"desc\":\"交易系统\"},{\"icon\":16,\"title\":\"/修炼帮助\",\"desc\":\"修炼系统\"},{\"icon\":16,\"title\":\"/职业帮助\",\"desc\":\"职业系统\"},{\"icon\":16,\"title\":\"/势力帮助\",\"desc\":\"势力系统\"}]}]")
      return
    }

    if (BMSG.victory != UID) {
      /**
       * 反馈战斗信息
       */
      e.reply('🤪挑战失败,你被对方击败了', {
        quote: e.msg_id
      })
      postHelp(e,"[{\"group\":\"通天塔\",\"list\":[{\"icon\":22,\"title\":\"/进入通天塔\",\"desc\":\"凝聚灵魂化身\"},{\"icon\":22,\"title\":\"/通天塔\",\"desc\":\"查看排名\"},{\"icon\":22,\"title\":\"/挑战+排名\",\"desc\":\"所向披靡\"}]},{\"group\":\"提升战力\",\"list\":[{\"icon\":14,\"title\":\"/闭关\",\"desc\":\"进行闭关\"},{\"icon\":14,\"title\":\"/出关\",\"desc\":\"增加修为\"},{\"icon\":21,\"title\":\"/锻体\",\"desc\":\"进行锻体\"},{\"icon\":21,\"title\":\"/凝脉\",\"desc\":\"锻炼气血\"},{\"icon\":21,\"title\":\"/打坐\",\"desc\":\"聚集灵气\"},{\"icon\":21,\"title\":\"/聚灵\",\"desc\":\"凝聚体内\"},{\"icon\":8,\"title\":\"/炼化+物品名\",\"desc\":\"炼化物品未本命物\"},{\"icon\":8,\"title\":\"/精炼\",\"desc\":\"强化本命物\"},{\"icon\":8,\"title\":\"/突破\",\"desc\":\"练气升级\"},{\"icon\":8,\"title\":\"/破境\",\"desc\":\"练体升级\"}]},{\"group\":\"其它\",\"list\":[{\"icon\":16,\"title\":\"/战斗帮助\",\"desc\":\"战斗系统\"},{\"icon\":16,\"title\":\"/地图帮助\",\"desc\":\"地图系统\"},{\"icon\":16,\"title\":\"/联盟帮助\",\"desc\":\"联盟系统\"},{\"icon\":8,\"title\":\"/黑市帮助\",\"desc\":\"交易系统\"},{\"icon\":16,\"title\":\"/修炼帮助\",\"desc\":\"修炼系统\"},{\"icon\":16,\"title\":\"/职业帮助\",\"desc\":\"职业系统\"},{\"icon\":16,\"title\":\"/势力帮助\",\"desc\":\"势力系统\"}]}]")
      return
    }

    /**
     * 如何交换位置？
     *
     * 对方的  uid
     * 和自身的uid 交换即可
     *
     */

    await DB.sky.update(
      {
        // 自身的 uid
        uid: data.uid
      },
      {
        where: {
          // 目标 id
          id: dataB.id
        }
      }
    )

    await DB.sky.update(
      {
        // 对方的
        uid: dataB.uid
      },
      {
        where: {
          // 自身的 id
          id: data.id
        }
      }
    )

    e.reply(`😶挑战成功,当前排名${id}`, {
      quote: e.msg_id
    })
    postHelp(e,"[{\"group\":\"通天塔\",\"list\":[{\"icon\":22,\"title\":\"/进入通天塔\",\"desc\":\"凝聚灵魂化身\"},{\"icon\":22,\"title\":\"/通天塔\",\"desc\":\"查看排名\"},{\"icon\":22,\"title\":\"/挑战+排名\",\"desc\":\"所向披靡\"}]},{\"group\":\"提升战力\",\"list\":[{\"icon\":14,\"title\":\"/闭关\",\"desc\":\"进行闭关\"},{\"icon\":14,\"title\":\"/出关\",\"desc\":\"增加修为\"},{\"icon\":21,\"title\":\"/锻体\",\"desc\":\"进行锻体\"},{\"icon\":21,\"title\":\"/凝脉\",\"desc\":\"锻炼气血\"},{\"icon\":21,\"title\":\"/打坐\",\"desc\":\"聚集灵气\"},{\"icon\":21,\"title\":\"/聚灵\",\"desc\":\"凝聚体内\"},{\"icon\":8,\"title\":\"/炼化+物品名\",\"desc\":\"炼化物品未本命物\"},{\"icon\":8,\"title\":\"/精炼\",\"desc\":\"强化本命物\"},{\"icon\":8,\"title\":\"/突破\",\"desc\":\"练气升级\"},{\"icon\":8,\"title\":\"/破境\",\"desc\":\"练体升级\"}]},{\"group\":\"其它\",\"list\":[{\"icon\":16,\"title\":\"/战斗帮助\",\"desc\":\"战斗系统\"},{\"icon\":16,\"title\":\"/地图帮助\",\"desc\":\"地图系统\"},{\"icon\":16,\"title\":\"/联盟帮助\",\"desc\":\"联盟系统\"},{\"icon\":8,\"title\":\"/黑市帮助\",\"desc\":\"交易系统\"},{\"icon\":16,\"title\":\"/修炼帮助\",\"desc\":\"修炼系统\"},{\"icon\":16,\"title\":\"/职业帮助\",\"desc\":\"职业系统\"},{\"icon\":16,\"title\":\"/势力帮助\",\"desc\":\"势力系统\"}]}]")
    return
  }
}
