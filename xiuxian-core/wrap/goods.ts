import { goods, type GoodsType } from 'xiuxian-db'
import { WhereOptions, literal } from 'sequelize'

/**
 * 转换函数集
 */
const map = {
  1: (item: GoodsType, name: string, size: number) => {
    return `\n[${item.name}]_攻击:${item.attack}%_${name}:${Math.floor(
      item.price * size
    )}`
  },
  2: (item: GoodsType, name: string, size: number) => {
    return `\n[${item.name}]_防御:${item.defense}%_${name}:${Math.floor(
      item.price * size
    )}`
  },
  3: (item: GoodsType, name: string, size: number) => {
    return `\n[${item.name}]_暴伤:${item.critical_damage}%_${name}:${Math.floor(
      item.price * size
    )}`
  },
  4: (item: GoodsType, name: string, size: number) => {
    if (item.addition == 'blood') {
      return `\n[${item.name}]_血量:${item.blood}%_${name}:${Math.floor(
        item.price * size
      )}`
    } else {
      return `\n[${item.name}]_修为:${
        item.exp_gaspractice
      }_${name}:${Math.floor(item.price * size)}`
    }
  },
  5: (item: GoodsType, name: string, size: number) => {
    return `\n[${item.name}]_天赋:${item.size}%_${name}:${Math.floor(
      item.price * size
    )}`
  },
  6: (item: GoodsType, name: string, size: number) => {
    return `\n[${item.name}]_类型:道具_${name}:${Math.floor(item.price * size)}`
  }
}

export const mapType = {
  武器: 1,
  护具: 2,
  法宝: 3,
  丹药: 4,
  功法: 5,
  道具: 6,
  材料: 7,
  装备: [1, 2, 3]
}

/**
 * 物品信息转换
 * @param list
 * @param param1
 * @returns
 */
export function getListMsg(list: GoodsType[], name = '灵石', size = 1) {
  // 存储转换
  const msg: string[] = []
  // 循环转换
  for (const item of list) {
    // 执行匹配并推送数据
    msg.push(map[item?.type](item, name, size))
  }
  // 返回
  return msg
}

/**
 * 得到随即物品
 * @param where
 * @returns
 */
export async function getRandomThing(where: WhereOptions<GoodsType>) {
  const data: GoodsType | null = (await goods.findOne({
    where,
    // 进行随机排序
    order: literal('RAND()'),
    raw: true
  })) as any
  return data
}

/**
 * 搜索指定物品信息
 * @param name
 * @returns
 */
export async function searchAllThing(name: string) {
  const da: GoodsType = (await goods.findOne({
    where: {
      name
    },
    raw: true
  })) as any
  return da
}
