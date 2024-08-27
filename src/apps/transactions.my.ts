import { Messages } from 'alemonjs'
import { transactions } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)我出售的$/, async e => {
  const UID = e.user_id
  await transactions
    .findAll({
      where: {
        uid: UID
      }
    })
    .then(res => res.map(r => r.dataValues))
    .then(res => {
      if (res.length === 0) {
        e.reply('你还没有出售任何物品')
        return
      }
      const msg = res.map(r => `物品:${r.name}, 数量:${r.count}`)
      e.reply(msg.join('\n'))
    })
})
