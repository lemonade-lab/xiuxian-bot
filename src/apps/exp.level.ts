import { Messages } from 'alemonjs'
import { levelUp } from 'xiuxian-api'
import { Redis } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?破境$/, async e => {
  /**
   * *******
   * lock start
   * *******
   */
  const KEY = `xiuxian:open:${e.user_id}`
  const LOCK = await Redis.get(KEY)
  if (LOCK) {
    e.reply('操作频繁')
    return
  }
  await Redis.set(KEY, 1, 'EX', 6)
  /**
   * lock end
   */

  levelUp(e, 7, 2, 80)
})
