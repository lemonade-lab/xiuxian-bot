import { Messages } from 'alemonjs'
import { levelUp } from 'xiuxian-api'
export default new Messages().response(/^(#|\/)?(顿悟|頓悟)$/, async e => {
  levelUp(e, 19, 3, 80)
})
