import { APlugin, Controllers, type AEvent } from 'alemonjs'
import {
  isThereAUserPresent,
  ControlByBlood,
  controlByName,
  GameApi
} from '../../api/index.js'

/**
 * 职业经验够了之后
 * 需要前往协会交付灵石来考核
 * 考核也就是造出一定等级的装备
 * 成功则颁发徽章
 * 失败则重新考核
 * 所有人默认没有职业
 * 可以前往协会领取职业徽章
 * 筑基期就可以领取职业
 * 领取职业后不可洗根
 * 拥有多灵根可领取的职业更多
 * 同时灵根变异可对炼丹有加成
 * 灵根多，加成的下降
 */

export class ClaimCareer extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?协会$/,
          fnc: 'association'
        },
        {
          reg: /^(#|\/)?炼器师学徒$/,
          fnc: 'craftsmanApprentice'
        },
        {
          reg: /^(#|\/)?炼丹师学徒$/,
          fnc: 'alchemistApprentice'
        },
        {
          reg: /^(#|\/)?阵法师学徒$/,
          fnc: 'masterApprentice'
        },
        {
          reg: /^(#|\/)?徽章信息$/,
          fnc: 'emblemInformation'
        }
      ]
    })
  }

  /**
   *协会
   * @param e
   * @returns
   */
  async association(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '协会'))) return
    e.reply([
      '[协会执事]😳叶子凡\n',
      '欢迎来到修仙协会\n',
      '化神境之后,可交付灵石获得学徒身份\n',
      '当前可领取[/炼器师学徒]'
    ])

    Controllers(e).Message.reply(
      '',
      [
        {
          label: '炼器师学徒',
          value: '/炼器师学徒'
        },
        {
          label: '炼丹师学徒',
          value: '/炼丹师学徒'
        },
        {
          label: '阵法师学徒',
          value: '/阵法师学徒'
        }
      ],
      [
        {
          label: '徽章信息',
          value: '/徽章信息'
        }
      ]
    )

    return
  }

  /**
   * 炼器师学徒
   * @param e
   * @returns
   */
  async craftsmanApprentice(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '协会'))) return
    e.reply(['[协会执事]😳叶子凡\n', '目前职业炼丹师\n'])
    return
  }

  /**
   * 炼丹师学徒
   * @param e
   * @returns
   */
  async alchemistApprentice(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '协会'))) return
    e.reply(['[协会执事]😳叶子凡\n', '待开放'])
    return
  }

  /**
   * 阵法师学徒
   * @param e
   * @returns
   */
  async masterApprentice(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '协会'))) return
    e.reply(['[协会执事]😳叶子凡\n', '待开放'])
    return
  }

  /**
   *徽章信息
   * @param e
   * @returns
   */
  async emblemInformation(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await ControlByBlood(e, UserData))) return
    e.reply('[协会执事]😳叶子凡\n暂未开放...')
    return
  }
}
