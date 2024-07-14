import { Op } from 'sequelize'
import { map_point, map_position } from 'xiuxian-db'
/**
 * 模糊搜索名字并判断是否在此地
 * @param action
 * @param addressName
 * @returns
 */
export async function mapExistence(x: number, y: number, addressName: string) {
  const PointData = await map_point
    .findOne({
      where: {
        name: {
          [Op.like]: `%${addressName}%` // 位置存在
        },
        x: x, // 位置匹配
        y: y
      }
    })
    .then(res => res.dataValues)
  if (PointData) return true
  return false
}

/**
 * 判断是否在某地
 * @param UID
 * @param addressName
 * @returns
 */
export async function mapAction(x: number, y: number, addressName: string) {
  return await mapExistence(x, y, addressName)
}

/**
 *
 * @param UID
 * @returns
 */
export async function getPlaceNameByUid(type: number, attribute: number) {
  return await getPlaceName(type, attribute)
}

/**
 * 根据信息得到未知
 * @param action
 * @returns
 */
export async function getPlaceName(type: number, attribute: number) {
  const PositionData = await map_position
    .findOne({
      where: {
        type: type,
        attribute: attribute
      }
    })
    .then(res => res.dataValues)
  if (PositionData) return PositionData.name
  return '未知地点'
}

/**
 * 查询数据
 * @param x
 * @param y
 * @param z
 * @returns
 */
export async function getRecordsByXYZ(x: number, y: number, z: number) {
  const records = await map_position
    .findOne({
      where: {
        x1: { [Op.lte]: x },
        x2: { [Op.gte]: x },
        y1: { [Op.lte]: y },
        y2: { [Op.gte]: y },
        z1: { [Op.lte]: z },
        z2: { [Op.gte]: z }
      }
    })
    .then(res => res.dataValues)
  return records
}
