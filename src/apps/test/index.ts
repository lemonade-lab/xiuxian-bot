import { plugin, type AEvent } from 'alemonjs'
import { postHelp } from '../../api/index.js'
export class test extends plugin {
  constructor() {
    super({
      rule: [
        // {
        //   reg: /./,
        //   fnc: 'testing'
        // },
        // {
        //   reg: /^(#|\/)?哎嗨$/,
        //   fnc: 'aihai'
        // },
        {
          reg: /^(#|\/)?你好$/,
          fnc: 'nihao'
        }
      ]
    })
  }

  // async testing(e: AEvent) {
  //   e.reply('维护中')
  //   return
  // }

  // async aihai(e: AEvent) {
  //   this.e.reply('开始上下文')
  //   this.setContext('aihai2')
  //   return
  // }

  // async aihai2(e: AEvent) {
  //   if (this.e.msg == '你好') {
  //     this.finish('aihai2')
  //     return false
  //   }
  //   e.reply('你好111')
  //   return
  // }

  async nihao(e: AEvent) {
    e.reply(e.segment.http('https://api.xingzhige.com/API/yshl/'))
    return
  }
}
