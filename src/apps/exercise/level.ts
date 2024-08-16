import { Messages } from 'alemonjs'
import { levelUp } from 'xiuxian-api'
const message = new Messages()
message.response(/^(#|\/)?突破$/, async e => {
  levelUp(e, 6, 1, 90)
})
message.response(/^(#|\/)?破境$/, async e => {
  levelUp(e, 7, 2, 80)
})
message.response(/^(#|\/)?(顿悟|頓悟)$/, async e => {
  levelUp(e, 19, 3, 80)
})
export const Level = message.ok
