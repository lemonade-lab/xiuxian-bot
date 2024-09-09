import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { Messages } from 'alemonjs'
import { ass } from 'xiuxian-db'
import { pictureRender } from 'xiuxian-img'
export default new Messages().response(/^(#|\/)?势力\d*$/, async e => {
  const UID = e.user_id
  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return
  const p = e.msg.replace(/^(#|\/)?势力/, '')
  const page = p == '' ? 1 : Number(p)
  const pageSize = GameApi.Cooling.pageSize
  const totalCount = await ass.count()
  const totalPages = Math.ceil(totalCount / pageSize)
  if (page > totalPages) return
  //
  ass
    .findAll({
      limit: GameApi.Cooling.pageSize,
      offset: (page - 1) * GameApi.Cooling.pageSize
    })
    .then(res => res.map(item => item.dataValues))
    .then(async res => {
      if (res.length === 0) {
        e.reply('没有找到数据')
        return
      }
      // 返回物品信息
      const img = await pictureRender('AssList', {
        name: 'AssList',
        props: {
          data: res,
          theme: UserData.theme
        }
      })
      //
      if (Buffer.isBuffer(img)) {
        e.reply(img)
      } else {
        e.reply('截图错误')
      }
    })
  return
})
