import { APlugin, Controllers, type AEvent } from 'alemonjs'
import { isThereAUserPresent } from './api/index.js'
export class Information extends APlugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)?/, fnc: 'controllers' }]
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
    e.reply('游戏维护中...')
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
        { label: '势力', value: '/势力' },
        {
          label: '官群',
          link: 'https://qm.qq.com/q/BUXl2xKabe'
        }
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
}
