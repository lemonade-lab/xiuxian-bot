import { plugin, type AEvent } from 'alemonjs'
import {
  DB,
  obtainingImages,
  GameApi,
  showUserMsg,
  Server,
  isUser
} from '../../api/index.js'
export class Information extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(个人|個人)信息$/, fnc: 'personalInformation' },
        { reg: /^(#|\/)?面板信息$/, fnc: 'equipmentInformation' },
        { reg: /^(#|\/)?功法信息$/, fnc: 'skillInformation' }
      ]
    })
  }

  /**
   * 个人信息
   * @param e
   * @returns
   */
  async personalInformation(e: AEvent) {
    const UID = e.user_id
    isUser(UID)
      .then(UserData => {
        if (!UserData) {
          e.reply('请先踏入仙途')
          return
        }

        GameApi.Users.update(UID, {
          avatar: e.user_avatar
        } as DB.UserType).then(() => {
          Promise.all([
            GameApi.Skills.updataEfficiency(UID, UserData.talent),
            GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now),
            showUserMsg(e)
          ]).catch(() => {
            e.reply('数据处理错误')
          })
        })
      })
      .catch(() => {
        e.reply('数据查询错误')
      })

    return
  }

  /**
   * 面板信息
   * @param e
   * @returns
   */
  async equipmentInformation(e: AEvent) {
    const UID = e.user_id
    isUser(UID)
      .then(UserData => {
        if (!UserData) {
          e.reply('请先踏入仙途')
          return
        }
        GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now).then(
          () => {
            Server.equipmentInformation(UID, e.user_avatar).then(res => {
              obtainingImages('/public/pages/equipment.vue', res).then(res => {
                e.reply(res)
              })
            })
          }
        )
      })
      .catch(() => {
        e.reply('数据查询错误')
      })
    return
  }

  /**
   * 功法信息
   * @param e
   * @returns
   */
  async skillInformation(e: AEvent) {
    const UID = e.user_id
    isUser(UID)
      .then(UserData => {
        if (!UserData) {
          e.reply('请先踏入仙途')
          return
        }
        GameApi.Skills.updataEfficiency(UID, UserData.talent).then(() => {
          Server.skillInformation(UID, e.user_avatar).then(res => {
            obtainingImages('/public/pages/skills.vue', res).then(res => {
              e.reply(res)
            })
          })
        })
      })
      .catch(() => {
        e.reply('数据查询错误')
      })

    return
  }
}
