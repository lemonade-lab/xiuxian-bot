import { isUser, sendReply } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import * as DB from 'xiuxian-db'
import { Messages } from 'alemonjs'
export default new Messages().response(/^(#|\/)?势力\d*$/, async e => {
  const UID = e.user_id
  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return
  const p = e.msg.replace(/^(#|\/)?势力/, '')
  const page = p == '' ? 1 : Number(p)
  const pageSize = GameApi.Cooling.pageSize
  const totalCount = await DB.ass.count()
  const totalPages = Math.ceil(totalCount / pageSize)
  if (page > totalPages) return
  const AuctionData = await DB.ass
    .findAll({
      limit: GameApi.Cooling.pageSize,
      offset: (page - 1) * GameApi.Cooling.pageSize
    })
    .then(res => res.map(item => item.dataValues))
  const msg: string[] = []
  for (const item of AuctionData) {
    msg.push(
      `\n🏹[${item.name}]-${item.grade ?? 0}\n⚔活跃:${
        item.activation
      }🗡名气:${item.fame}`
    )
  }

  sendReply(e, `___[势力]___(${page}/${totalPages})`, msg)

  return
})
