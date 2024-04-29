import { APlugin, Controllers, type AEvent } from 'alemonjs'
import {
  DB,
  GameApi,
  showUserMsg,
  Server,
  isUser,
  getEquipmentComponent,
  getSkillsComponent,
  createUser,
  isThereAUserPresent
} from '../../api/index.js'
import { Themes } from '../../component/core/color.js'
//
export class Information extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(个人|個人)信息$/, fnc: 'personalInformation' },
        { reg: /^(#|\/)?面板信息$/, fnc: 'equipmentInformation' },
        { reg: /^(#|\/)?功法信息$/, fnc: 'skillInformation' },
        { reg: /^(#|\/)?我的编号$/, fnc: 'myUserID' },
        { reg: /^(#|\/)?控制板$/, fnc: 'controllers' },
        { reg: /^(#|\/)?修炼$/, fnc: 'cultivation' },
        { reg: /^(#|\/)?更换主题$/, fnc: 'updateTheme' },
        { reg: /^(#|\/)?榜单$/, fnc: 'list' },
        { reg: /^(#|\/)?新人$/, fnc: 'newUsers' },
        { reg: /^(#|\/)?交易$/, fnc: 'shop' },
        { reg: /^(#|\/)?天下$/, fnc: 'word' },
        { reg: /^(#|\/)?设置密码/, fnc: 'setPassword' }
      ]
    })
  }

  /**
   * 设置密码
   * @param e
   * @returns
   */
  async setPassword(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const password = e.msg.replace(/^(#|\/)?设置密码/, '')
    var regex = /^[a-zA-Z0-9]+$/
    const m = Controllers(e).Message

    const post = () => {
      m.reply('', [
        { label: '我的编号', value: '/我的编号' },
        { label: '设置密码', value: '/设置密码+[数字/字母]', enter: false },
        { label: '控制板', value: '/控制板' }
      ])
    }

    if (!regex.test(password)) {
      e.reply('密码必须只包含数字或字母')
      post()
      return
    } else {
      // 更新用户密码
      DB.user
        .update(
          {
            password: password
          },
          {
            where: {
              uid: UID
            }
          }
        )
        .then(res => {
          if (res.includes(0)) {
            e.reply('设置错误')
            post()
          } else {
            e.reply('设置成功')
            m.reply('', [
              { label: '我的编号', value: '/我的编号' },
              { label: '易物阁', link: 'http://43.143.217.7/' },
              { label: '控制板', value: '/控制板' }
            ])
          }
        })
        .catch(() => {
          e.reply('数据错误')
        })
    }
    return
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
   *
   * @param e
   */
  async word(e: AEvent) {
    Controllers(e).Message.reply(
      '',
      [
        { label: '联盟商会', value: '/联盟商会' },
        { label: '协会', value: '/协会' }
      ],
      [
        { label: '金银坊', value: '/金银坊' },
        { label: '万宝楼', value: '/万宝楼' }
      ]
    )
  }

  async shop(e: AEvent) {
    Controllers(e).Message.reply(
      '',
      [
        { label: '我的编号', value: '/我的编号' },
        { label: '设置密码', value: '/设置密码+[数字/字母]', enter: false },
        { label: '易物阁', link: 'http://43.143.217.7/' }
      ],
      [
        { label: '万宝楼', value: '/万宝楼' },
        { label: '商会', value: '/联盟商会' },
        { label: '控制板', value: '/控制板' }
      ]
    )
  }

  async newUsers(e: AEvent) {
    Controllers(e).Message.reply(
      '',
      [
        { label: '更换主题', value: '/更换主题' },
        { label: '绑定头像', value: '/绑定头像+输入QQ号', enter: false },
        { label: '再入仙途', value: '/再入仙途' }
      ],
      [
        { label: '签名', value: '/签名', enter: false },
        { label: '改名', value: '/改名', enter: false }
      ],
      [
        { label: '修仙联盟', value: '/前往联盟' },
        { label: '控制板', value: '/控制板' }
      ]
    )
  }

  /**
   *
   * @param e
   */
  async list(e: AEvent) {
    Controllers(e).Message.reply('', [
      { label: '通天塔', value: '/通天塔' },
      { label: '杀神榜', value: '/杀神榜' },
      { label: '控制板', value: '/控制板' }
    ])
  }

  async cultivation(e: AEvent) {
    Controllers(e).Message.reply(
      '',
      [
        { label: '锻体', value: '/锻体' },
        { label: '打坐', value: '/打坐' },
        { label: '闭关', value: '/闭关' },
        { label: '出关', value: '/出关' }
      ],
      [
        { label: '顿悟', value: '/顿悟' },
        { label: '突破', value: '/突破' },
        { label: '破境', value: '/破境' }
      ],
      [
        { label: '探索灵矿', value: '/探索灵矿' },
        { label: '探索怪物', value: '/探索怪物' },
        { label: '释放神识', value: '/释放神识' }
      ]
    )
  }

  /**
   *
   * @param e
   * @returns
   */
  async controllers(e: AEvent) {
    Controllers(e).Message.reply(
      '',
      [
        { label: '资料', value: '/个人信息' },
        { label: '面板', value: '/面板信息' },
        { label: '功法', value: '/功法信息' }
      ],
      [
        { label: '交易', value: '/交易' },
        { label: '修炼', value: '/修炼' },
        { label: '榜单', value: '/榜单' },
        { label: '赶路', value: '/赶路' }
      ],
      [
        { label: '天下', value: '/天下' },
        { label: '势力', value: '/势力' }
      ],
      [
        { label: '储物', value: '/储物袋' },
        { label: '纳戒', value: '/纳戒' },
        { label: '地图', value: '/地图' },
        { label: '新人', value: '/新人' }
      ]
    )
    return true
  }

  /**
   *
   * @param e
   */
  async updateTheme(e: AEvent) {
    const UID = e.user_id
    isUser(UID)
      .then(UserData => {
        if (!UserData) {
          createUser(e)
          return
        }
        // 得到配置
        const index = Themes.indexOf(UserData.theme)
        // 如果存在
        if (Themes[index + 1]) {
          // 切换
          UserData.theme = Themes[index + 1]
          // 保存
        } else {
          // 不存在。返回第一个
          UserData.theme = Themes[0]
        }
        // 更新主题后。
        GameApi.Users.update(UID, {
          avatar: e.user_avatar,
          theme: UserData.theme
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
          createUser(e)
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
          createUser(e)
          return
        }
        GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now).then(
          () => {
            Server.equipmentInformation(UID, e.user_avatar).then(res => {
              getEquipmentComponent(res, UID).then(img => {
                if (typeof img != 'boolean') {
                  e.reply(img)
                  Controllers(e).Message.reply('', [
                    { label: '个人信息', value: '/个人信息' },
                    { label: '功法信息', value: '/功法信息' },
                    { label: '控制板', value: '/控制板' }
                  ])
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
          createUser(e)
          return
        }
        GameApi.Skills.updataEfficiency(UID, UserData.talent).then(() => {
          Server.skillInformation(UID, e.user_avatar).then(res => {
            getSkillsComponent(res, UID).then(img => {
              if (typeof img != 'boolean') {
                e.reply(img)
                Controllers(e).Message.reply('', [
                  { label: '个人信息', value: '/个人信息' },
                  { label: '面板信息', value: '/面板信息' },
                  { label: '控制板', value: '/控制板' }
                ])
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
