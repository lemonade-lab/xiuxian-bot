import { user_compensate } from 'xiuxian-db'
export const install = {}
export const start_time = '2023-10-02 12:00'
export const end_time = '2023-10-02 23:59'

export async function add(UID: string, time: string) {
  await user_compensate.create({
    uid: UID,
    time: time
  })
}

/**
 * 读取
 * @param UID
 * @param time
 * @returns
 */
export async function read(UID: string, time: string) {
  const data = await user_compensate
    .findOne({
      where: {
        time,
        uid: UID
      }
    })
    .then(res => res?.dataValues)
  return data
}

/**
 * 领取补偿
 * @param UID
 */
export async function verify(UID: string) {
  // 检查是否在特定时间段内
  const currentTime = new Date().getTime(),
    startTime = new Date(start_time).getTime(),
    endTime = new Date(end_time).getTime()
  if (currentTime < startTime || currentTime > endTime) {
    // 不在特定时间段内
    return false
  }
  // 查看存档
  const CompensateData = await read(UID, start_time)
  // 领取存在
  if (CompensateData) return false
  // 不存在呢就要新增了
  await add(UID, start_time)
  // 如果领奖日期不存在,可以领奖？
  return true
}
