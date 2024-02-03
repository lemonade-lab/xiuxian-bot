import { type AuctionType, auction } from '../../../db/index.js'

/**
 * 读取
 * @param ID
 * @returns
 */
export async function read(ID: number) {
  const data: AuctionType = (await auction.findOne({
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
  await auction.destroy({
    where: {
      id: Number(ID)
    }
  })
}

/**
 * 更新
 * @param ID
 */
export async function update(ID: number, val: any) {
  await auction.update(val, {
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
  await auction.create(val)
}
