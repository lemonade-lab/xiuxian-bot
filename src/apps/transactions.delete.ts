import { Messages } from 'alemonjs'
import { operationLock } from 'xiuxian-core'
import { transactions } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)测试$/, async e => {
  // const T = await operationLock(e.user_id)
  // if (!T) {
  //     e.reply('操作频繁')
  //     return
  // }
  // const body = ctx.request.body as {
  //     id: number
  // }
  // console.log('body-delete', body)
  // if (!body.id) {
  //     ctx.body = {
  //         code: ERROE_CODE,
  //         msg: '非法请求',
  //         data: null
  //     }
  //     return
  // }
  // //
  // if (TransactionMap.has(body.id)) {
  //     ctx.body = {
  //         code: ERROE_CODE,
  //         msg: '请求频繁',
  //         data: null
  //     }
  //     return
  // }
  // TransactionMap.set(body.id, 0)
  // const UID = ctx.state.user.uid
  // const data = (await transactions.findOne({
  //     where: {
  //         id: body.id
  //     },
  //     raw: true
  // })) as any
  // console.log('data', data)
  // await transactions
  //     .destroy({
  //         where: {
  //             id: body.id,
  //             // 必须属于自己的
  //             uid: UID
  //         }
  //     })
  //     .then(res => {
  //         console.log('res', res)
  //         if (res == 1) {
  //             // 还回来。
  //             Bag.addBagThing(UID, [
  //                 {
  //                     name: data.name,
  //                     acount: data.count
  //                 }
  //             ])
  //             ctx.body = {
  //                 code: OK_CODE,
  //                 msg: '删除完成',
  //                 data: 1
  //             }
  //         } else {
  //             ctx.body = {
  //                 code: OK_CODE,
  //                 msg: '下架失败',
  //                 data: 0
  //             }
  //         }
  //     })
  //     .catch(err => {
  //         // 失败
  //         ctx.body = {
  //             code: ERROE_CODE,
  //             msg: '请求失败',
  //             data: err
  //         }
  //     })
  // TransactionMap.delete(body.id)
  // return
})
