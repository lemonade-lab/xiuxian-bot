import { Messages } from 'alemonjs'
import { levelUp } from 'xiuxian-api'
export default new Messages().response(/^(#|\/)?破境$/, async e => {
  levelUp(e, 7, 2, 80)
})
