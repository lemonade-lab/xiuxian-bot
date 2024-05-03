import { APlugin, ClientNTQQ, Controllers, type AEvent } from 'alemonjs'
import { isThereAUserPresent } from './api/index.js'
// import { QQ_GROUP } from './model/config/index.js'

const TemplateId = '102055332_1713102677'

export class Information extends APlugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)?模板消息/, fnc: 'controllers' }]
    })
  }

  /**
   *
   * @param e
   * @returns
   */
  async controllers(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    let p = ClientNTQQ.createTemplate(TemplateId)
    p.text('叶凡')
    p.button({ label: '击杀', value: '/个人信息' })
    Controllers(e).Message.card([p.getParam()])
    p = null
    return true
  }
}
