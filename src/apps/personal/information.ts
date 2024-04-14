import { APlugin, ClientNTQQ, Controllers, type AEvent } from 'alemonjs'
import {
  DB,
  GameApi,
  showUserMsg,
  Server,
  isUser,
  getEquipmentComponent,
  getSkillsComponent
} from '../../api/index.js'
export class Information extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(个人|個人)信息$/, fnc: 'personalInformation' },
        { reg: /^(#|\/)?面板信息$/, fnc: 'equipmentInformation' },
        { reg: /^(#|\/)?功法信息$/, fnc: 'skillInformation' },
        { reg: /^(#|\/)?我的编号$/, fnc: 'myUserID' },
        { reg: /^(#|\/)?(帮助|操作面板|面板)$/, fnc: 'controllers' }
      ]
    })
  }

  /**
   *
   * @param e
   * @returns
   */
  async controllers(e: AEvent) {
    Controllers(e).Message.reply(
      '按钮',
      [
        { label: '个人信息', value: '/个人信息' },
        { label: '面板信息', value: '/面板信息' },
        { label: '装备信息', value: '/装备信息' }
      ],
      [
        { label: '闭关', value: '/闭关' },
        { label: '出关', value: '/出关' },
        { label: '前往', value: '/前往联盟', enter: false }
      ],
      [
        { label: '探索怪物', value: '/探索怪物' },
        { label: '探索零矿', value: '/探索零矿' },
        { label: '释放神识', value: '/释放神识' }
      ],
      [
        { label: '虚空镜', value: '/储物袋' },
        { label: '虚空板', value: '/虚空板' },
        { label: '虚空灯', value: '/虚空灯' }
      ],
      [
        { label: '突破', value: '/突破' },
        { label: '储物袋', value: '/储物袋' },
        { label: '纳戒', value: '/纳戒' }
      ]
    )
    return true
  }

  /**
   *
   * @param e
   * @returns
   */
  async myUserID(e: AEvent) {
    e.reply(e.user_id)
    return
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
              getEquipmentComponent(res).then(img => {
                if (typeof img != 'boolean') {
                  e.reply(img)
                }
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
            getSkillsComponent(res).then(img => {
              if (typeof img != 'boolean') {
                e.reply(img)
              }
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
