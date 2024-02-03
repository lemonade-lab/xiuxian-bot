import { plugin, type AEvent } from 'alemonjs'
import {
  DB,
  GameApi,
  showUserMsg,
  victoryCooling,
  isUser
} from '../../api/index.js'
export class Start extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?踏入仙途$/, fnc: 'createMsg' },
        { reg: /^(#|\/)?再入仙途$/, fnc: 'reCreateMsg' },
        { reg: /^(#|\/)?绑定企鹅\d+$/, fnc: 'binding' },
        { reg: /^(#|\/)?解绑企鹅$/, fnc: 'delBinding' }
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

              e.reply(
                [
                  `修仙大陆第${res.id}位萌新`,
                  '\n记得去联盟报到开宝箱噢',
                  '\n签到还有特殊奖励'
                ],
                {
                  quote: e.msg_id
                }
              )

              if (e.platform == 'ntqq') {
                e.reply(['可使用[/绑定企鹅+QQ]切换头像'], {
                  quote: e.msg_id
                })
              }

              e.reply(['发送[/修仙帮助]了解更多'], {
                quote: e.msg_id
              })

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
   *再入仙途
   * @param e
   * @returns
   */
  async reCreateMsg(e: AEvent) {
    const UID = e.user_id

    // 确保是用户
    isUser(UID)
      .then(res => {
        if (!res) {
          e.reply('请先[/踏入仙途]')
          return
        }

        /**
         * 不存在或者过期了
         */
        if (!reStart[UID] || reStart[UID] + 30000 < new Date().getTime()) {
          reStart[UID] = new Date().getTime()
          e.reply(
            ['[重要提示]\n请30s内再次发送[(#|/)再入仙途]', '\n以确认转世'],
            {
              quote: e.msg_id
            }
          )
          return
        }

        /**
         * 规定时间内操作
         */

        const CDID = 8
        const CDTime = GameApi.Cooling.CD_Reborn

        /**
         * 检查冷却s
         */
        victoryCooling(e, UID, CDID).then(res => {
          if (!res) return

          /**
           * 重置用户
           */
          GameApi.Player.updatePlayer(UID, e.user_avatar)
            .then(res => {
              // 设置redis
              GameApi.Burial.set(UID, CDID, CDTime)

              // 重新查询用户
              isUser(UID)
                .then(UserData => {
                  // 新手提示
                  e.reply(
                    [
                      `修仙大陆第${UserData.id}位萌新`,
                      '\n记得去联盟报到开宝箱噢',
                      '\n签到还有特殊奖励'
                    ],
                    {
                      quote: e.msg_id
                    }
                  )

                  if (e.platform == 'ntqq') {
                    e.reply(['可使用[/绑定企鹅+QQ]切换头像'], {
                      quote: e.msg_id
                    })
                  }

                  e.reply(['发送[/修仙帮助]了解更多'], {
                    quote: e.msg_id
                  })

                  /**
                   * 并发
                   */
                  Promise.all([
                    // 更新
                    GameApi.Equipment.updatePanel(
                      UID,
                      UserData.battle_blood_now
                    ),
                    // 更新
                    GameApi.Skills.updataEfficiency(UID, UserData.talent),
                    // 发送图片
                    showUserMsg(e)
                  ])

                  // 清除询问
                  delete reStart[UID]
                })

                .catch(() => {
                  e.reply('数据查询失败')
                })
            })
            .catch(err => {
              e.reply('冷却检查错误')
            })
        })
      })
      .catch(() => {
        e.reply('数据查询失败')
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
          e.reply('请先[/踏入仙途]')
          return
        }
        GameApi.Users.update(UID, {
          phone: null
        } as DB.UserType)
          .then(() => {
            e.reply([`绑定成功`], {
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
   * 绑定企鹅
   * @param e
   * @returns
   */
  async binding(e: AEvent) {
    const UID = e.user_id

    isUser(UID)
      .then(res => {
        if (!res) {
          e.reply('请先[/踏入仙途]')
          return
        }
        const qq = e.msg.replace(/^(#|\/)?绑定企鹅/, '').split('*')
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
