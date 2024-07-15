import { user } from 'xiuxian-db'
import { Redis } from 'xiuxian-db'
import { RedisBull, RedisBullAction } from '../config/index.js'
import * as State from '../users/base/state.js'
import * as Map from './map.js'
import { Queue, Worker } from 'bullmq'

// 创建
const QUEUE = new Queue(RedisBull, {
  connection: Redis
})

// 创建
new Worker(
  RedisBull,
  async ({ data: { UID, x, y, z, size } }) => {
    // 得到目的地
    const { pont_x, pont_y } = await user
      .findOne({
        attributes: ['pont_x', 'pont_y'],
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)
    const direction = await Redis.get(`${RedisBullAction}:${UID}:action`)
    // 如果x对齐了  还是走y
    if (direction == '0' || pont_x == x) {
      // 这个size要注意了 如果   y是 100  py是98 +5 就超过了
      const distance = Math.abs(y - pont_y) // 计算当前坐标与目标坐标之间的距离
      const step = Math.min(size, distance) // 确定下一步移动的距离（取`size`和距离之间的较小值）
      const direction = Math.sign(y - pont_y) // 确定移动的方向（向上为负值，向下为正值）
      const s = pont_y + step * direction // 计算新的`y`坐标
      const mData = await Map.getRecordsByXYZ(pont_x, s, z)
      // 走y
      await user.update(
        {
          point_type: mData.type,
          pont_attribute: mData.attribute,
          pont_y: s
        },
        {
          where: {
            uid: UID
          }
        }
      )
      // 设置记录
      Redis.set(`${RedisBullAction}:${UID}:action`, '1')
      if (x == pont_x && y == s) {
        cancelJob(UID).catch(err => {
          console.error(err)
        })
      }
    } else if (direction == '1' || pont_y == y) {
      const distance = Math.abs(x - pont_x) // 计算当前坐标与目标坐标之间的距离
      const step = Math.min(size, distance) // 确定下一步移动的距离（取 `size` 和距离之间的较小值）
      const direction = Math.sign(x - pont_x) // 确定移动的方向（向右为正值，向左为负值）
      const s = pont_x + step * direction // 计算新的 `x` 坐标
      const mData = await Map.getRecordsByXYZ(s, pont_y, z)
      // 走x
      await user.update(
        {
          point_type: mData.type,
          pont_attribute: mData.attribute,
          pont_x: s
        },
        {
          where: {
            uid: UID
          }
        }
      )
      // 设置记录
      Redis.set(`${RedisBullAction}:${UID}:action`, '0')
      if (x == s && y == pont_y) {
        cancelJob(UID).catch(err => {
          console.error(err)
        })
      }
    }
  },
  {
    connection: Redis
  }
)

/**
 * 设置任务
 * @param UID
 * @param x
 * @param y
 * @param z
 * @param type
 * @param att
 * @param time
 * @returns
 */
export async function setJob(
  UID: any,
  x: number,
  y: number,
  z: number,
  size: number
) {
  // 设置行为赶路
  await State.set(UID, {
    actionID: 3,
    startTime: new Date().getTime(),
    endTime: 99999999999
  })

  // 推送任务
  await QUEUE.add(
    // 任务数据
    UID,
    {
      UID,
      x,
      y,
      z,
      size: Math.floor(size)
    },
    {
      jobId: UID, // 指定 jobId
      repeat: {
        pattern: '*/3 * * * * *'
      }
    }
  )

  // 记录方向
  Redis.set(`${RedisBullAction}:${UID}:action`, '0')

  return
}

/**
 * 取消
 * @param UID
 * @returns
 */
export async function cancelJob(UID: string) {
  const jobs = await QUEUE.getRepeatableJobs()
  const jobsToRemove = jobs
    .filter(item => item.id == UID)
    .map(async item => {
      try {
        await QUEUE.removeRepeatableByKey(item.key)
      } catch (err) {
        console.error(err)
      }
    })
  await Promise.all(jobsToRemove)

  // 解放玩家状态
  State.del(UID)

  return
}

export function estimateTotalExecutionTime(
  pont_x: number,
  pont_y: number,
  x: number,
  y: number,
  size: number,
  stepTime: number
): {
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
  totalMilliseconds: number
} {
  const distanceX = Math.abs(x - pont_x) // 计算 x 坐标的距离
  const distanceY = Math.abs(y - pont_y) // 计算 y 坐标的距离
  const stepsX = Math.ceil(distanceX / size) // 计算需要的 x 方向步数
  const stepsY = Math.ceil(distanceY / size) // 计算需要的 y 方向步数
  const totalSteps = stepsX + stepsY // 总步数
  const totalExecutionTime = totalSteps * stepTime // 总执行时间（毫秒）

  const hours = Math.floor(totalExecutionTime / (1000 * 60 * 60))
  const minutes = Math.floor(
    (totalExecutionTime % (1000 * 60 * 60)) / (1000 * 60)
  )
  const seconds = Math.floor((totalExecutionTime % (1000 * 60)) / 1000)
  const milliseconds = totalExecutionTime % 1000

  return {
    hours,
    minutes,
    seconds,
    milliseconds,
    totalMilliseconds: totalExecutionTime
  }
}
