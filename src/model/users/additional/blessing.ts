import { type UserBlessingType, user_blessing } from '../../../db/index.js'

/**
 * 写入
 * @param UID
 * @param param1
 */
export async function write(UID: string, data: UserBlessingType) {
  await user_blessing.update(data, {
    where: {
      uid: UID
    }
  })
}

/**
 * 读取
 * @param UID
 * @returns
 */
export async function read(UID: string) {
  const data: UserBlessingType = (await user_blessing.findOne({
    where: {
      uid: UID
    },
    raw: true
  })) as any
  return data
}

/**
 * 月卡用户
 * @param UID
 * @returns
 */
export async function isVip(UID: string) {
  const BlessingData = await read(UID)
  if (!BlessingData || !BlessingData.day || BlessingData.day <= 0) {
    return false
  }
  return true
}

/**
 * 领取物品
 * @param UID
 * @returns
 */
export async function collectItems(UID: string) {
  /**
   * 读取数据
   */
  const BlessingData = await read(UID)
  /**
   * 没有数据直接返回
   */
  if (!BlessingData) return false
  /**
   * 获取今日日期
   */
  const time = formatDate(new Date())
  /**
   * 检查今日是否签到
   */
  if (BlessingData.receive[time]) {
    // 今天的记录存在
    return false
  }

  // 计算
  let size = 1
  // 今天未签到,上一次的签到时间存在
  if (BlessingData.time) {
    // 转换为日期
    const TIME = formatDate(new Date(BlessingData.time))
    // 看看日期
    if (BlessingData.receive[TIME]) {
      // 记录存在,记录时间差
      size = getTimeSize(BlessingData.time)
    }
  }

  if (size > 1) {
    // 清除签到时间
    BlessingData.time = 0
  }

  // 减少次数,把之前的也补上
  BlessingData.day -= size

  if (!determine(UID, BlessingData)) {
    // 扣完了,直接返回
    return false
  }

  // 记录签到时间
  BlessingData.time = new Date().getTime()

  // 领取成功
  BlessingData.receive[time] = true

  await write(UID, BlessingData)
  return true
}

/**
 * 得到日期差
 * @param time
 * @returns
 */
export function getTimeSize(time: string | number) {
  const oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒数
  const lastSignInDate = new Date(time).getTime() // 上一次日期的毫秒数
  const currentDate = new Date().getTime() // 今天日期的毫秒数
  const daysDiff = Math.round(Math.abs((currentDate - lastSignInDate) / oneDay))
  return daysDiff
}

/**
 * 结算时候过期
 * @param UID
 * @param BlessingData
 * @returns
 */
export function determine(UID: string, BlessingData) {
  if (BlessingData.day <= 0) {
    // 过期了
    BlessingData.day = 0
    // 清除签到时间
    BlessingData.time = 0
    write(UID, BlessingData)
    return false
  }
  return true
}

/**
 * 得到日期
 * @param date
 * @returns
 */
export function formatDate(date: Date) {
  const isoString = date.toISOString()
  const datePart = isoString.substring(0, 10)
  return datePart.replace(/-/g, '-')
}

/**
 * 给指定玩家充值
 * @param {*} UID 编号
 * @param {*} day 天数
 * @returns
 */
export async function recharge(UID, day = 30) {
  /**
   * 充值的时候，不是新建就是 更新 不能是其他的
   */

  // 查看数据
  let BlessingData = await this.read(UID)
  /**
   * 读取为空,必须初始化数据
   */
  if (!BlessingData) {
    await this.create(UID)
    BlessingData = {
      day: 0,
      record: [],
      receive: {},
      time: 0
    }
  }
  /**
   * 如何更新？  首先就涉及一个  上一次使用时间的问题了
   */

  // 重置 0
  if (BlessingData.day <= 0) {
    BlessingData.day = 0
  }

  // 0开始计算
  let size = 0

  if (BlessingData.time) {
    // 存在日期
    const TIME = this.formatDate(new Date(BlessingData.time))
    // 看看日期
    if (BlessingData.receive[TIME]) {
      // 记录存在
      size = this.getTimeSize(BlessingData.time)
    }
  }

  if (size > 0) {
    // 清除签到时间
    BlessingData.time = 0
  }

  // 结算
  BlessingData.day -= size

  // 以前的月卡都过期了
  if (BlessingData.day <= 0) {
    // 过期了
    BlessingData.day = 0
  }

  // 推送充值记录
  if (!BlessingData.record) {
    BlessingData.record = []
  }

  BlessingData.record.push({
    time: this.formatDate(new Date()), // 充值的时间
    day
  })

  BlessingData.day += day

  await this.write(UID, BlessingData)

  return
}
