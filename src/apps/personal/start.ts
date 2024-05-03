import { APlugin, Controllers, type AEvent } from 'alemonjs'
import {
  DB,
  GameApi,
  showUserMsg,
  victoryCooling,
  isUser,
  createUser
} from '../../api/index.js'
export class Start extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?踏入仙途$/, fnc: 'createMsg' },
        { reg: /^(#|\/)?绑定(头像|企鹅)\d+$/, fnc: 'binding' },
        { reg: /^(#|\/)?解绑(头像|企鹅)$/, fnc: 'delBinding' }
      ]
    })
  }

  /**
   *踏入仙途
   * @param e
   * @returns
   */
  async createMsg(e: AEvent) {
    const UID = e.user_id

    DB.user
      .findOne({
        attributes: ['uid'],
        where: {
          uid: e.user_id
        },
        raw: true
      })
      .then((res: any) => res as DB.UserType)
      .then(async res => {
        if (!res) {
          // 刷新用户信息
          GameApi.Player.updatePlayer(UID, e.user_avatar)
            .then(() => {
              // 设置冷却
              GameApi.Burial.set(UID, 8, GameApi.Cooling.CD_Reborn)
              if (e.platform == 'ntqq') {
                Controllers(e).Message.reply(
                  '',
                  [
                    { label: '绑定头像', value: '/绑定头像+QQ', enter: false },
                    { label: '修仙帮助', value: '/修仙帮助' }
                  ],
                  [{ label: '修仙联盟', value: '/前往联盟' }]
                )
              } else {
                e.reply(
                  [`修仙大陆第${res.id}位萌新`, '\n发送[/修仙帮助]了解更多'],
                  {
                    quote: e.msg_id
                  }
                )
              }
              // 显示资料
              showUserMsg(e)
            })
            .catch(err => {
              e.reply(['未寻得仙缘'], {
                quote: e.msg_id
              })
            })
        } else {
          // 显示资料
          showUserMsg(e)
        }
      })
      .catch(err => {
        e.reply('数据查询错误')
      })

    return
  }

  /**
   *  解绑企鹅
   * @param e
   * @returns
   */
  async delBinding(e: AEvent) {
    const UID = e.user_id
    isUser(UID)
      .then(res => {
        if (!res) {
          createUser(e)
          return
        }
        GameApi.Users.update(UID, {
          phone: null
        } as DB.UserType)
          .then(() => {
            e.reply([`解绑成功`], {
              quote: e.msg_id
            })
          })
          .catch(() => {
            e.reply('数据变更错误')
          })
      })
      .catch(() => {
        e.reply('数据查询错误')
      })

    return
  }

  /**
   * (头像|企鹅)
   * @param e
   * @returns
   */
  async binding(e: AEvent) {
    const UID = e.user_id

    isUser(UID)
      .then(res => {
        if (!res) {
          createUser(e)
          return
        }
        const qq = e.msg.replace(/^(#|\/)?绑定(头像|企鹅)/, '').split('*')
        if (qq.length >= 20) {
          e.reply('错误长度', {
            quote: e.msg_id
          })
          return
        }
        GameApi.Users.update(UID, {
          phone: Number(qq)
        } as DB.UserType)
          .then(res => {
            e.reply([`绑定${qq}成功`], {
              quote: e.msg_id
            })
          })
          .catch(() => {
            e.reply('绑定失败')
          })
      })
      .catch(() => {
        e.reply('数据查询错误')
      })

    return
  }
}

const reStart = {}
