import { Messages } from 'alemonjs'
import { levelUp } from 'xiuxian-api'
import { operationLock } from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?(顿悟|頓悟)$/, async e => {
  /**
   * *******
   * lock start
   * *******
   */
  const T = await operationLock(e.user_id)
  if (!T) {
    e.reply('操作频繁')
    return
  }
  /**
   * lock end
   */

  levelUp(e, 19, 3, 80)
})
