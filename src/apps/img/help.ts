import { APlugin, Controllers, type AEvent } from 'alemonjs'
import { postHelp } from '../../api/index.js'
export class Help extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(修仙(帮|幫)助|帮助)$/, fnc: 'getBaseHelp' },
        { reg: /^(#|\/)?黑市(帮|幫)助$/, fnc: 'getDarkHelp' },
        { reg: /^(#|\/)?地图(帮|幫)助$/, fnc: 'getMapHelp' },
        { reg: /^(#|\/)?天机(帮|幫)助$/, fnc: 'getHeavenlyHelp' },
        { reg: /^(#|\/)?联盟(帮|幫)助$/, fnc: 'getUnionHelp' },
        { reg: /^(#|\/)?战斗(帮|幫)助$/, fnc: 'getFightHelp' },
        { reg: /^(#|\/)?修炼(帮|幫)助$/, fnc: 'getPracticeHelp' },
        { reg: /^(#|\/)?势力(帮|幫)助$/, fnc: 'getAssHelp' },
        { reg: /^(#|\/)?职业(帮|幫)助$/, fnc: 'getCareerHelp' }
      ]
    })
  }

  /**
   *
   * @param e
   * @returns
   */
  async getBaseHelp(e: AEvent) {
    // 是ntqq就不再需要帮助图了
    if (e.platform == 'ntqq') {
      Controllers(e).Message.reply(
        '',
        [
          { label: '战斗帮助', value: '/战斗帮助' },
          { label: '地图帮助', value: '/地图帮助' },
          { label: '职业帮助', value: '/职业帮助' }
        ],
        [
          { label: '天机帮助', value: '/天机帮助' },
          { label: '黑市帮助', value: '/黑市帮助' },
          { label: '联盟帮助', value: '/联盟帮助' }
        ],
        [
          { label: '修炼帮助', value: '/修炼帮助' },
          { label: '势力帮助', value: '/势力帮助' }
        ],
        [
          {
            label: '加入官群',
            link: 'https://qm.qq.com/q/BUXl2xKabe'
          },
          {
            label: '地图',
            value: '/地图'
          },
          { label: '控制板', value: '/控制板' }
        ]
      )
    } else {
      postHelp(e, 'base_help')
    }
    return
  }

  /**
   * 职业
   * @param e
   * @returns
   */
  async getCareerHelp(e: AEvent) {
    postHelp(e, 'career_help')
    return
  }

  /**
   * 势力
   * @param e
   * @returns
   */
  async getAssHelp(e: AEvent) {
    postHelp(e, 'ass_help')
    return
  }

  /**
   *
   * @param e
   * @returns
   */
  async getPracticeHelp(e: AEvent) {
    postHelp(e, 'practice_help')
    return
  }

  /**
   *
   * @param e
   * @returns
   */
  async getDarkHelp(e: AEvent) {
    postHelp(e, 'dark_help')
    return
  }

  /**
   *
   * @param e
   * @returns
   */
  async getMapHelp(e: AEvent) {
    postHelp(e, 'map_help')
    return
  }

  /**
   *
   * @param e
   * @returns
   */
  async getHeavenlyHelp(e: AEvent) {
    postHelp(e, 'heavenly_help')
    return
  }

  /**
   *
   * @param e
   * @returns
   */
  async getUnionHelp(e: AEvent) {
    postHelp(e, 'union_help')
    return
  }

  /**
   *
   * @param e
   * @returns
   */
  async getFightHelp(e: AEvent) {
    postHelp(e, 'fight_help')
    return
  }
}
