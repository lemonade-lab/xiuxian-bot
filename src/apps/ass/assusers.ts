import { APlugin, Controllers, type AEvent } from 'alemonjs'
import {
  isThereAUserPresent,
  DB,
  GameApi,
  sendReply,
  postHelp
} from '../../api/index.js'
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
          reg: /^(#|\/)?势力\d*$/,
          fnc: 'world'
        }
      ]
    })
  }

  /**
   * 势力
   * @param e
   */
  async world(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const p = e.msg.replace(/^(#|\/)?势力/, '')
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

    sendReply(e, `___[势力]___(${page}/${totalPages})`, msg)

    Controllers(e).Message.reply(
      '',
      [
        { label: '信息', value: '/势力信息' },
        { label: '管理', value: '/势力管理' },
        {
          label: '建立',
          value: '/建立+名称',
          enter: false
        }
      ],
      [
        {
          label: '解散',
          value: '/解散'
        },
        {
          label: '加入',
          value: '/加入'
        },
        {
          label: '退出',
          value: '/退出'
        }
      ]
    )
    postHelp(
      e,
      '[{"group":"详情","list":[{"icon":14,"title":"/势力+?页数","desc":"查看势力"},{"icon":14,"title":"/势力信息","desc":"查看个人相关势力"},{"icon":14,"title":"/查看+名称","desc":"查看指定势力信息"}]},{"group":"行为","list":[{"icon":14,"title":"/建立+名称","desc":"建立指令类型势力"},{"icon":14,"title":"/解散","desc":"解散势力"},{"icon":14,"title":"/加入+势力名","desc":"加入指定势力"},{"icon":14,"title":"/退出+势力名","desc":"退出势力/取消申请"}]},{"group":"/势力管理","list":[{"icon":14,"title":"/审核+名称","desc":"查看所有待审核名录"},{"icon":14,"title":"/通过+标记","desc":"允许加入势力"},{"icon":14,"title":"/踢出+标记","desc":"踢出势力"},{"icon":14,"title":"/提拔+UID","desc":"提拔玩家"},{"icon":14,"title":"/贬值+UID","desc":"贬值玩家"},{"icon":14,"title":"/扩建","desc":"提升宗门等级"},{"icon":14,"title":"/扩建宝库","desc":"提升宗门藏宝阁等级"}]}]'
    )
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
      postHelp(
        e,
        '[{"group":"详情","list":[{"icon":14,"title":"/势力+?页数","desc":"查看势力"},{"icon":14,"title":"/势力信息","desc":"查看个人相关势力"},{"icon":14,"title":"/查看+名称","desc":"查看指定势力信息"}]},{"group":"行为","list":[{"icon":14,"title":"/建立+名称","desc":"建立指令类型势力"},{"icon":14,"title":"/解散","desc":"解散势力"},{"icon":14,"title":"/加入+势力名","desc":"加入指定势力"},{"icon":14,"title":"/退出+势力名","desc":"退出势力/取消申请"}]},{"group":"/势力管理","list":[{"icon":14,"title":"/审核+名称","desc":"查看所有待审核名录"},{"icon":14,"title":"/通过+标记","desc":"允许加入势力"},{"icon":14,"title":"/踢出+标记","desc":"踢出势力"},{"icon":14,"title":"/提拔+UID","desc":"提拔玩家"},{"icon":14,"title":"/贬值+UID","desc":"贬值玩家"},{"icon":14,"title":"/扩建","desc":"提升宗门等级"},{"icon":14,"title":"/扩建宝库","desc":"提升宗门藏宝阁等级"}]}]'
      )
      return
    }

    for (const item of UserAss) {
      // 待加入
      if (item.identity == GameApi.Config.ASS_IDENTITY_MAP['9']) {
        e.reply([
          `🏹[${item['ass.name']}]-${item[`ass.ass_typing.${item.identity}`]}`
        ])
        postHelp(
          e,
          '[{"group":"详情","list":[{"icon":14,"title":"/势力+?页数","desc":"查看势力"},{"icon":14,"title":"/势力信息","desc":"查看个人相关势力"},{"icon":14,"title":"/查看+名称","desc":"查看指定势力信息"}]},{"group":"行为","list":[{"icon":14,"title":"/建立+名称","desc":"建立指令类型势力"},{"icon":14,"title":"/解散","desc":"解散势力"},{"icon":14,"title":"/加入+势力名","desc":"加入指定势力"},{"icon":14,"title":"/退出+势力名","desc":"退出势力/取消申请"}]},{"group":"/势力管理","list":[{"icon":14,"title":"/审核+名称","desc":"查看所有待审核名录"},{"icon":14,"title":"/通过+标记","desc":"允许加入势力"},{"icon":14,"title":"/踢出+标记","desc":"踢出势力"},{"icon":14,"title":"/提拔+UID","desc":"提拔玩家"},{"icon":14,"title":"/贬值+UID","desc":"贬值玩家"},{"icon":14,"title":"/扩建","desc":"提升宗门等级"},{"icon":14,"title":"/扩建宝库","desc":"提升宗门藏宝阁等级"}]}]'
        )
      } else {
        e.reply([
          `🏹[${item['ass.name']}]-${item['ass.grade']}`,
          `\n身份:${item[`ass.ass_typing.${item.identity}`]}`,
          `\n灵池:${item[`ass.property`]}`,
          `\n活跃:${item['ass.activation']}`,
          `\n名气:${item['ass.fame']}`,
          `\n贡献:${item['contribute']}`
        ])
        postHelp(
          e,
          '[{"group":"详情","list":[{"icon":14,"title":"/势力+?页数","desc":"查看势力"},{"icon":14,"title":"/势力信息","desc":"查看个人相关势力"},{"icon":14,"title":"/查看+名称","desc":"查看指定势力信息"}]},{"group":"行为","list":[{"icon":14,"title":"/建立+名称","desc":"建立指令类型势力"},{"icon":14,"title":"/解散","desc":"解散势力"},{"icon":14,"title":"/加入+势力名","desc":"加入指定势力"},{"icon":14,"title":"/退出+势力名","desc":"退出势力/取消申请"}]},{"group":"/势力管理","list":[{"icon":14,"title":"/审核+名称","desc":"查看所有待审核名录"},{"icon":14,"title":"/通过+标记","desc":"允许加入势力"},{"icon":14,"title":"/踢出+标记","desc":"踢出势力"},{"icon":14,"title":"/提拔+UID","desc":"提拔玩家"},{"icon":14,"title":"/贬值+UID","desc":"贬值玩家"},{"icon":14,"title":"/扩建","desc":"提升宗门等级"},{"icon":14,"title":"/扩建宝库","desc":"提升宗门藏宝阁等级"}]}]'
        )
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
      postHelp(
        e,
        '[{"group":"详情","list":[{"icon":14,"title":"/势力+?页数","desc":"查看势力"},{"icon":14,"title":"/势力信息","desc":"查看个人相关势力"},{"icon":14,"title":"/查看+名称","desc":"查看指定势力信息"}]},{"group":"行为","list":[{"icon":14,"title":"/建立+名称","desc":"建立指令类型势力"},{"icon":14,"title":"/解散","desc":"解散势力"},{"icon":14,"title":"/加入+势力名","desc":"加入指定势力"},{"icon":14,"title":"/退出+势力名","desc":"退出势力/取消申请"}]},{"group":"/势力管理","list":[{"icon":14,"title":"/审核+名称","desc":"查看所有待审核名录"},{"icon":14,"title":"/通过+标记","desc":"允许加入势力"},{"icon":14,"title":"/踢出+标记","desc":"踢出势力"},{"icon":14,"title":"/提拔+UID","desc":"提拔玩家"},{"icon":14,"title":"/贬值+UID","desc":"贬值玩家"},{"icon":14,"title":"/扩建","desc":"提升宗门等级"},{"icon":14,"title":"/扩建宝库","desc":"提升宗门藏宝阁等级"}]}]'
      )
      return
    }
    const { aData } = v

    e.reply([
      `🏹[${aData['name']}]-${aData['grade']}`,
      `\n灵池:${aData[`property`]}`,
      `\n活跃:${aData['activation']}`,
      `\n名气:${aData['fame']}`
    ])
    postHelp(
      e,
      '[{"group":"详情","list":[{"icon":14,"title":"/势力+?页数","desc":"查看势力"},{"icon":14,"title":"/势力信息","desc":"查看个人相关势力"},{"icon":14,"title":"/查看+名称","desc":"查看指定势力信息"}]},{"group":"行为","list":[{"icon":14,"title":"/建立+名称","desc":"建立指令类型势力"},{"icon":14,"title":"/解散","desc":"解散势力"},{"icon":14,"title":"/加入+势力名","desc":"加入指定势力"},{"icon":14,"title":"/退出+势力名","desc":"退出势力/取消申请"}]},{"group":"/势力管理","list":[{"icon":14,"title":"/审核+名称","desc":"查看所有待审核名录"},{"icon":14,"title":"/通过+标记","desc":"允许加入势力"},{"icon":14,"title":"/踢出+标记","desc":"踢出势力"},{"icon":14,"title":"/提拔+UID","desc":"提拔玩家"},{"icon":14,"title":"/贬值+UID","desc":"贬值玩家"},{"icon":14,"title":"/扩建","desc":"提升宗门等级"},{"icon":14,"title":"/扩建宝库","desc":"提升宗门藏宝阁等级"}]}]'
    )

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
    postHelp(
      e,
      '[{"group":"详情","list":[{"icon":14,"title":"/势力+?页数","desc":"查看势力"},{"icon":14,"title":"/势力信息","desc":"查看个人相关势力"},{"icon":14,"title":"/查看+名称","desc":"查看指定势力信息"}]},{"group":"行为","list":[{"icon":14,"title":"/建立+名称","desc":"建立指令类型势力"},{"icon":14,"title":"/解散","desc":"解散势力"},{"icon":14,"title":"/加入+势力名","desc":"加入指定势力"},{"icon":14,"title":"/退出+势力名","desc":"退出势力/取消申请"}]},{"group":"/势力管理","list":[{"icon":14,"title":"/审核+名称","desc":"查看所有待审核名录"},{"icon":14,"title":"/通过+标记","desc":"允许加入势力"},{"icon":14,"title":"/踢出+标记","desc":"踢出势力"},{"icon":14,"title":"/提拔+UID","desc":"提拔玩家"},{"icon":14,"title":"/贬值+UID","desc":"贬值玩家"},{"icon":14,"title":"/扩建","desc":"提升宗门等级"},{"icon":14,"title":"/扩建宝库","desc":"提升宗门藏宝阁等级"}]}]'
    )
    return
  }
}
