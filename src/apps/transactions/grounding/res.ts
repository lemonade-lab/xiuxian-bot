import { Text, useParse, useSend } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { Bag, Cooling, operationLock } from 'xiuxian-core'
import { goods, transactions, user_bag } from 'xiuxian-db'
export default OnResponse(
  async e => {
    const T = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }
    //
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    // 解析文本
    const text = useParse(e.Megs, 'Text')
    //  /上架物品名*数量*价格
    const [name, countx, pricex] = text
      .replace(/^(#|\/)?上架/, '')
      .trim()
      .split('*')
    const count = Math.floor(isNaN(Number(countx)) ? 1 : Number(countx))
    const price = Math.floor(isNaN(Number(pricex)) ? 1 : Number(pricex))
    // 查询物品
    const data = await transactions
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)

    if (data) {
      Send(Text('已有上架物品'))
      return
    }

    const gData = await goods
      .findOne({
        where: {
          name: name
        }
      })
      .then(res => res?.dataValues)

    //
    if (!gData) {
      Send(Text('出错物品，请联系管理员'))
      return
    }

    if (Number(price) > gData.price * Cooling.MAX_PRICE_P * count) {
      Send(Text('你在尝试违规定价,操作已取消'))
      return
    }

    // 查询 物品
    const thing = await user_bag
      .findOne({
        where: {
          uid: UID,
          name: name
        }
      })
      .then(res => res?.dataValues)

    if (!thing) {
      Send(Text('物品不存在'))
      return
    }

    if (thing.acount < count) {
      Send(Text(`[${thing.name}]*${thing.acount}物品不足`))
      return
    }

    //
    const createAt = new Date()

    await transactions
      .create({
        uid: UID,
        name: name,
        count: Number(count),
        price: Number(price),
        createAt: createAt
      })
      .then(async () => {
        // 减少物品
        await Bag.reduceBagThing(UID, [
          {
            name: thing.name,
            acount: count
          }
        ])
        Send(Text('上架成功'))
      })
      .catch(err => {
        console.error(err)
        // 确保物品被删除
        transactions.destroy({
          where: {
            uid: UID,
            name: name,
            createAt: createAt
          }
        })
        Send(Text('上架失败'))
      })
  },
  'message.create',
  /^(#|\/)?上架/
)
