import { APlugin, type AEvent } from 'alemonjs'
import { postHelp } from '../../api/index.js'
export class Help extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?修仙(帮|幫)助$/, fnc: 'getBaseHelp' },
        { reg: /^(#|\/)?黑市(帮|幫)助$/, fnc: 'getDarkHelp' },
        { reg: /^(#|\/)?地图(帮|幫)助$/, fnc: 'getMapHelp' },
        { reg: /^(#|\/)?天机(帮|幫)助$/, fnc: 'getHeavenlyHelp' },
        { reg: /^(#|\/)?联盟(帮|幫)助$/, fnc: 'getUnionHelp' },
        { reg: /^(#|\/)?战斗(帮|幫)助$/, fnc: 'getFightHelp' },
        { reg: /^(#|\/)?修炼(帮|幫)助$/, fnc: 'getPracticeHelp' },
        { reg: /^(#|\/)?虚空(帮|幫)助$/, fnc: 'getImitateHelp' },
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
    postHelp(e, 'base_help')
    return true
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
  async getImitateHelp(e: AEvent) {
    postHelp(e, 'imitate_help')
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
