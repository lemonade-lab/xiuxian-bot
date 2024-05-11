import { APlugin } from 'alemonjs'
export class test extends APlugin {
  constructor() {
    super()
    this.rule = [
      {
        reg: /^你好/,
        fnc: this.show.name
      }
    ]
  }

  async show() {
    this.e.reply(this.e.user_id)
  }
}
