import { APlugin, type AEvent } from 'alemonjs'
import { isThereAUserPresent, DB, GameApi, sendReply } from '../../api/index.js'
export class AssSsers extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?势力信息$/,
          fnc: 'messageAss'
        },
        {
          reg: /^(#|\/)?查看[\u4e00-\u9fa5]+$/,
          fnc: 'mAss'
        },
        {
          reg: /^(#|\/)?天下\d*$/,
          fnc: 'world'
        }
      ]
    })
  }

  /**
   * 天下
   * @param e
   */
  async world(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const p = e.msg.replace(/^(#|\/)?天下/, '')
    const page = p == '' ? 1 : Number(p)
    const pageSize = GameApi.Cooling.pageSize
    const totalCount = await DB.ass.count()
    const totalPages = Math.ceil(totalCount / pageSize)
    if (page > totalPages) return
    const AuctionData: DB.AssType[] = (await DB.ass.findAll({
      /**
       * 需要先排序
       */
      raw: true,
      limit: GameApi.Cooling.pageSize,
      offset: (page - 1) * GameApi.Cooling.pageSize
    })) as any
    const msg: string[] = []
    for (const item of AuctionData) {
      msg.push(
        `\n🏹[${item.name}]-${item.grade ?? 0}\n⚔活跃:${
          item.activation
        }🗡名气:${item.fame}`
      )
    }
    sendReply(e, `___[天下]___(${page}/${totalPages})`, msg)
    return
  }

  /**
   * 我的势力
   * @param e
   * @returns
   */
  async messageAss(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return

    // 需要关联外键
    const UserAss: DB.UserAssType[] = (await DB.user_ass.findAll({
      where: {
        uid: UID
      },
      include: [
        {
          model: DB.ass,
          include: [
            {
              model: DB.ass_typing
            }
          ]
        }
      ],
      raw: true
    })) as any

    if (!UserAss || UserAss?.length == 0) {
      e.reply('未加入任何势力', {
        quote: e.msg_id
      })
      return
    }

    for (const item of UserAss) {
      // 待加入
      if (item.identity == GameApi.Config.ASS_IDENTITY_MAP['9']) {
        e.reply([
          `🏹[${item['ass.name']}]-${item[`ass.ass_typing.${item.identity}`]}`
        ])
      } else {
        e.reply([
          `🏹[${item['ass.name']}]-${item['ass.grade']}`,
          `\n身份:${item[`ass.ass_typing.${item.identity}`]}`,
          `\n灵池:${item[`ass.property`]}`,
          `\n活跃:${item['ass.activation']}`,
          `\n名气:${item['ass.fame']}`,
          `\n贡献:${item['contribute']}`
        ])
      }
    }

    return
  }

  /**
   * 资料
   * @param e
   */
  async mAss(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const name = e.msg.replace(/^(#|\/)?查看/, '')
    const v = await GameApi.Ass.v(UID, name)
    if (v == false) return
    if (v == '权能不足') {
      e.reply(v)
      return
    }
    const { aData } = v

    e.reply([
      `🏹[${aData['name']}]-${aData['grade']}`,
      `\n灵池:${aData[`property`]}`,
      `\n活跃:${aData['activation']}`,
      `\n名气:${aData['fame']}`
    ])

    const uData: DB.UserAssType[] = (await DB.user_ass.findAll({
      where: {
        aid: aData.id,
        identity: { [DB.Op.ne]: GameApi.Config.ASS_IDENTITY_MAP['9'] }
      },
      include: [
        {
          model: DB.user
        }
      ],
      raw: true
    })) as any

    const msg = []

    for (const item of uData) {
      console.log(item)
      msg.push(
        `\n🔹标记:${item.id}_道号[${item['user.name']}]\n身份:${
          aData[`ass_typing.${item.identity}`]
        }_贡献:${item['contribute']}`
      )
    }

    sendReply(e, `🏹[${aData['name']}]-${aData['grade']}`, msg)
    return
  }
}
