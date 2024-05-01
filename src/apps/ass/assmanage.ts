import { APlugin, Controllers, type AEvent } from 'alemonjs'
import { isThereAUserPresent, DB, GameApi, sendReply,postHelp } from '../../api/index.js'
export class AssManage extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?审核[\u4e00-\u9fa5]+$/,
          fnc: 'ruleAss'
        },
        {
          reg: /^(#|\/)?通过\d+$/,
          fnc: 'decisionAss'
        },
        {
          reg: /^(#|\/)?踢出\d+$/,
          fnc: 'dismissAss'
        },
        {
          reg: /^(#|\/)?扩建$/,
          fnc: 'improreAss'
        },
        {
          reg: /^(#|\/)?扩建宝库$/,
          fnc: 'improreAssTreasure'
        },
        {
          reg: /^(#|\/)?提拔.*$/,
          fnc: 'promoteAss'
        },
        {
          reg: /^(#|\/)?贬职.*$/,
          fnc: 'demotionAss'
        },
        {
          reg: /^(#|\/)?势力管理$/,
          fnc: 'admini'
        }
      ]
    })
  }

  async admini(e: AEvent) {
    Controllers(e).Message.reply(
      '',
      [
        { label: '审核', value: '/审核', enter: false },
        {
          label: '通过',
          value: '/通过',
          enter: false
        },
        {
          label: '踢出',
          value: '/踢出',
          enter: false
        }
      ],
      [
        {
          label: '扩建',
          value: '/扩建'
        },
        {
          label: '建库',
          value: '/扩建宝库'
        },
        {
          label: '提拔',
          value: '/提拔',
          enter: false
        },
        {
          label: '贬职',
          value: '/贬职',
          enter: false
        }
      ],
      [
        {
          label: '控制板',
          value: '/控制板'
        }
      ]
    )
    postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
  }

  /**
   * 审核
   * @param e
   * @returns
   */
  async ruleAss(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const name = e.msg.replace(/^(#|\/)?审核/, '')
    const v = await GameApi.Ass.v(UID, name)
    if (v === false) return
    if (v === '权能不足') {
      e.reply(v)
      postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      return
    }

    const { aData } = v

    const uData: DB.UserAssType[] = (await DB.user_ass.findAll({
      where: {
        aid: aData.id,
        identity: GameApi.Config.ASS_IDENTITY_MAP['9']
      },
      include: [
        {
          model: DB.user
        }
      ],
      raw: true
    })) as any

    if (!uData || uData.length == 0) {
      e.reply('暂无申请')
      postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      return
    }

    const msg = []

    for (const item of uData) {
      msg.push(
        `\n标记:${item.id}_编号:${item['user.uid']}\n昵称:${item['user.name']}`
      )
    }

    sendReply(e, `[${aData.name}名录]`, msg)
    postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
    return
  }

  /**
   * 通过
   * @param e
   * @returns
   */
  async decisionAss(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return

    const id = Number(e.msg.replace(/^(#|\/)?通过/, ''))

    if (!id) return

    const uData: DB.UserAssType = (await DB.user_ass.findOne({
      where: {
        id: Number(id),
        identity: GameApi.Config.ASS_IDENTITY_MAP['9']
      },
      include: [
        {
          model: DB.ass
        }
      ],
      raw: true
    })) as any

    // 不存在该条目
    if (!uData) return

    const v = await GameApi.Ass.v(UID, uData['ass.name'])
    if (v === false) return
    if (v === '权能不足') {
      e.reply(v)
      postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      return
    }

    const { aData } = v

    const data: DB.UserAssType[] = (await DB.user_ass.findAll({
      where: {
        aid: aData.id,
        identity: { [DB.Op.ne]: GameApi.Config.ASS_IDENTITY_MAP['9'] }
      },
      raw: true
    })) as any

    if (data.length >= (aData.grade + 1) * 5) {
      e.reply('人数已达上限', {
        quote: e.msg_id
      })
      postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      return
    }

    await DB.user_ass
      .update(
        {
          identity: GameApi.Config.ASS_IDENTITY_MAP['8']
        } as DB.UserAssType,
        {
          where: {
            id: Number(id)
          }
        }
      )
      .then(() => {
        e.reply('审核通过', {
          quote: e.msg_id
        })
        postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      })
      .catch(() => {
        e.reply('审核失败', {
          quote: e.msg_id
        })
        postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      })

    return
  }

  /**
   * 踢出
   * @param e
   */
  async dismissAss(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const id = Number(e.msg.replace(/^(#|\/)?踢出/, ''))
    if (!id) return
    const uData: DB.UserAssType = (await DB.user_ass.findOne({
      where: {
        id: Number(id)
      },
      include: [
        {
          model: DB.ass
        }
      ],
      raw: true
    })) as any

    // 不存在该条目
    if (!uData) return

    const v = await GameApi.Ass.v(UID, uData['ass.name'])
    if (v === false) return
    if (v === '权能不足') {
      e.reply(v)
      postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      return
    }
    const { UserAss } = v

    if (uData.authentication <= UserAss.authentication) {
      e.reply('权能过低')
      postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      return
    }

    await DB.user_ass
      .destroy({
        where: {
          id: Number(id)
        }
      })
      .then(() => {
        e.reply('踢出成功', {
          quote: e.msg_id
        })
        postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      })
      .catch(() => {
        e.reply('踢出失败', {
          quote: e.msg_id
        })
        postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      })

    return
  }

  /**
   * 升级
   * @param e
   */
  async improreAss(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UIDData: DB.UserAssType = (await DB.user_ass.findOne({
      where: {
        uid: UID
      },
      include: [
        {
          model: DB.ass
        }
      ],
      raw: true
    })) as any

    const v = await GameApi.Ass.v(UID, UIDData['ass.name'])
    if (v === false) return
    if (v === '权能不足') {
      e.reply(v)
      postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      return
    }
    if (UIDData['ass.grade'] > 4) return e.reply('宗门等级已达最高')
    const goods = await GameApi.Bag.searchBagByName(UID, '开天令')
    const num = GameApi.Cooling.upgradeass[UIDData['ass.grade']]
    if (!goods) return e.reply('你没有开天令')
    if (goods.acount < num) return e.reply('开天令不足')
    GameApi.Bag.reduceBagThing(UID, [{ name: '开天令', acount: num }])
    await DB.ass.update(
      { grade: UIDData['ass.grade'] + 1 },
      {
        where: {
          id: UIDData.aid
        }
      }
    )
    await e.reply('扩建成功')
    postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
    return
  }

  /**
   * 升级宝库
   * @param e
   */
  async improreAssTreasure(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UIDData: DB.UserAssType = (await DB.user_ass.findOne({
      where: {
        uid: UID
      },
      include: [
        {
          model: DB.ass
        }
      ],
      raw: true
    })) as any
    const v = await GameApi.Ass.v(UID, UIDData['ass.name'])
    if (v === false) return
    if (v === '权能不足') {
      e.reply(v)
      postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      return
    }
    if (UIDData['ass.bag_grade'] > 4) {
      e.reply('宗门宝库等级已达最高')
      postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      return 
    }

    const goods = await GameApi.Bag.searchBagByName(UID, '开天令')
    const num = GameApi.Cooling.upgradeass[UIDData['ass.bag_grade']]
    if (!goods){
      e.reply('你没有开天令')
      return postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
    }
    if (goods.acount < num){
      e.reply('开天令不足')
      return postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
    } 
    GameApi.Bag.reduceBagThing(UID, [{ name: '开天令', acount: num }])
    await DB.ass
      .update(
        {
          bag_grade: UIDData['ass.bag_grade'] + 1
        },
        {
          where: {
            id: UIDData.aid
          }
        }
      )
      .then(() => {
        e.reply('升级完成', {
          quote: e.msg_id
        })
        postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      })
      .catch(() => {
        e.reply('升级失败', {
          quote: e.msg_id
        })
        postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      })
    return
  }
  /**
   * 提拔
   * @param e
   */
  async promoteAss(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const id = e.msg.replace(/^(#|\/)?提拔/, '')
    if (!id) return
    const uData: DB.UserAssType = (await DB.user_ass.findOne({
      where: {
        uid: id
      },
      include: [
        {
          model: DB.ass
        }
      ],
      raw: true
    })) as any
    // 不存在该玩家
    if (!uData) return
    if (!(uData.authentication - 1)){
      e.reply('权能已达最高')
      return postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
    } 
    const v = await GameApi.Ass.v(UID, uData['ass.name'])
    if (v === false) return
    if (v === '权能不足') {
      e.reply(v)
      postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      return
    }
    const { UserAss } = v
    if (uData.authentication <= UserAss.authentication) {
      e.reply('权能过低')
      postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      return
    }
    uData.authentication -= 1
    uData.identity = GameApi.Config.ASS_IDENTITY_MAP[uData.authentication]
    await DB.user_ass
      .update(uData, {
        where: {
          uid: id
        }
      })
      .then(() => {
        e.reply('提拔成功', {
          quote: e.msg_id
        })
        postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      })
      .catch(() => {
        e.reply('提拔失败', {
          quote: e.msg_id
        })
        postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      })

    return
  }
  /**
   * 贬职
   * @param e
   */
  async demotionAss(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const id = e.msg.replace(/^(#|\/)?贬职/, '')
    if (!id) return
    const uData: DB.UserAssType = (await DB.user_ass.findOne({
      where: {
        uid: id
      },
      include: [
        {
          model: DB.ass
        }
      ],
      raw: true
    })) as any
    // 不存在该玩家
    if (!uData) return
    if (uData.authentication == 9){
      e.reply('权能已达最低')
      return postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
    } 
    const v = await GameApi.Ass.v(UID, uData['ass.name'])
    if (v === false) return
    if (v === '权能不足') {
      e.reply(v)
      postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      return
    }
    const { UserAss } = v
    if (uData.authentication <= UserAss.authentication) {
      e.reply('权能过低')
      postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      return
    }
    uData.authentication += 1
    await DB.user_ass
      .update(uData, {
        where: {
          uid: id
        }
      })
      .then(() => {
        e.reply('贬职成功', {
          quote: e.msg_id
        })
        postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      })
      .catch(() => {
        e.reply('贬职失败', {
          quote: e.msg_id
        })
        postHelp(e,"[{\"group\":\"详情\",\"list\":[{\"icon\":14,\"title\":\"/势力+?页数\",\"desc\":\"查看势力\"},{\"icon\":14,\"title\":\"/势力信息\",\"desc\":\"查看个人相关势力\"},{\"icon\":14,\"title\":\"/查看+名称\",\"desc\":\"查看指定势力信息\"}]},{\"group\":\"行为\",\"list\":[{\"icon\":14,\"title\":\"/建立+名称\",\"desc\":\"建立指令类型势力\"},{\"icon\":14,\"title\":\"/解散\",\"desc\":\"解散势力\"},{\"icon\":14,\"title\":\"/加入+势力名\",\"desc\":\"加入指定势力\"},{\"icon\":14,\"title\":\"/退出+势力名\",\"desc\":\"退出势力/取消申请\"}]},{\"group\":\"/势力管理\",\"list\":[{\"icon\":14,\"title\":\"/审核+名称\",\"desc\":\"查看所有待审核名录\"},{\"icon\":14,\"title\":\"/通过+标记\",\"desc\":\"允许加入势力\"},{\"icon\":14,\"title\":\"/踢出+标记\",\"desc\":\"踢出势力\"},{\"icon\":14,\"title\":\"/提拔+UID\",\"desc\":\"提拔玩家\"},{\"icon\":14,\"title\":\"/贬值+UID\",\"desc\":\"贬值玩家\"},{\"icon\":14,\"title\":\"/扩建\",\"desc\":\"提升宗门等级\"},{\"icon\":14,\"title\":\"/扩建宝库\",\"desc\":\"提升宗门藏宝阁等级\"}]}]")
      })

    return
  }
}
