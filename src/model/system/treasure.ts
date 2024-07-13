import {
  map_treasure,
  map_position,
  type MapPositionType,
  type MapTreasureType
} from '../../db/src'

import { literal } from 'sequelize'

/**
 * 写入
 * @param NAME
 * @param TYPE
 * @param ACOUNT
 * @returns
 */
export async function add(NAME: string, TYPE: number, ACOUNT: number) {
  const name = String(NAME)
  if (Number(TYPE) == 6 || ACOUNT < 10 || name.indexOf('灵石') != -1) {
    // 如果是道具就不分
    await create(NAME, ACOUNT)
    return
  }
  const totalCount = ACOUNT
  let remainingCount = totalCount
  while (remainingCount > 0) {
    const count = Math.min(remainingCount, 10)
    remainingCount -= count
    await create(NAME, count)
  }
}

/**
 * 小分添加
 * @param NAME
 * @param count
 */
export async function create(NAME: string, count: number) {
  const da: MapPositionType[] = (await map_position.findOne({
    where: {
      // 不要城池和天外天
      type: [2, 3, 4, 5, 6, 8, 9, 10, 11]
    },
    order: [literal('rand()')],
    limit: 1,
    raw: true
  })) as any
  const position = da[0]
  if (!position) return
  const mx =
      Math.floor(Math.random() * (position.x2 - position.x1)) +
      Number(position.x1),
    my =
      Math.floor(Math.random() * (position.y2 - position.y1)) +
      Number(position.y1),
    mz =
      Math.floor(Math.random() * (position.z2 - position.z1)) +
      Number(position.z1)

  await map_treasure.create({
    name: NAME,
    acount: count,
    type: position.type,
    attribute: position.attribute,
    x: mx,
    y: my,
    z: mz
  } as MapTreasureType)
}
