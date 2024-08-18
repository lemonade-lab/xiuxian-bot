import { Messages } from 'alemonjs'
import { levelUp } from 'xiuxian-api'
export default new Messages().response(/^(#|\/)?突破$/, async e => {
  levelUp(e, 6, 1, 90)
})
