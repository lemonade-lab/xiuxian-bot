import { APlugin, Controllers, type AEvent } from 'alemonjs'
import { showUserMsg, isUser, createUser } from 'xiuxian-api'

import * as DB from 'xiuxian-db'

import * as GameApi from 'xiuxian-core'

export class Start extends APlugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)?踏入仙途$/, fnc: 'createMsg' }]
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
        }
      })
      .then(res => res.dataValues)
      .then(async res => {
        if (!res) {
          // 刷新用户信息
          GameApi.Player.updatePlayer(UID, e.user_avatar)
            .then(() => {
              // 设置冷却
              GameApi.Burial.set(UID, 8, GameApi.Cooling.CD_Reborn)
              Controllers(e).Message.reply(
                '',
                [{ label: '修仙帮助', value: '/修仙帮助' }],
                [{ label: '修仙联盟', value: '/前往联盟' }]
              )
              e.reply(
                [`修仙大陆第${res.id}位萌新`, '\n发送[/修仙帮助]了解更多'],
                {
                  quote: e.msg_id
                }
              )
              // 显示资料
              showUserMsg(e)
            })
            .catch(_ => {
              e.reply(['未寻得仙缘'], {
                quote: e.msg_id
              })
            })
        } else {
          // 显示资料
          showUserMsg(e)
        }
      })
      .catch(_ => {
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
        })
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
}
