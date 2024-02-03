import { exchange, ExchangeType } from '../../../db/index.js'
/**
 * 读取
 * @param ID
 * @returns
 */
export async function read(ID: number) {
  const data: ExchangeType = (await exchange.findOne({
    where: {
      id: Number(ID)
    },
    raw: true
  })) as any
  return data
}

/**
 * 删除
 * @param ID
 */
export async function del(ID: number) {
  await exchange.destroy({
    where: {
      id: Number(ID)
    }
  })
}

/**
 * 创建
 * @param val
 */
export async function create(val: any) {
  await exchange.create(val)
}
