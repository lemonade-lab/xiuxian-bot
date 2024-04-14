import { Controllers, type AEvent } from 'alemonjs'
// 用户模型
import * as State from '../model/users/base/state.js'
// 附加模型
import * as Bag from '../model/users/additional/bag.js'
// 快捷方法
import * as Map from '../model/wrap/map.js'
import * as Method from '../model/wrap/method.js'
// 探索宝物
import * as Treasure from '../model/system/treasure.js'
// 集合
import * as Users from '../model/users/index.js'
import * as Burial from '../model/wrap/burial.js'
import * as Levels from '../model/users/additional/levels.js'
import * as Equipment from '../model/users/additional/equipment.js'
import * as Cooling from '../model/config/cooling.js'
// 缓存
import { urlHelpCache } from '../utils/cache.js'
import {
  user,
  activity,
  type UserType,
  type ActivityType
} from '../db/index.js'
// img
import { personalInformation } from '../server/information.js'
import ImageComponent from '../image/index.js'

/**
 * 显示个人信息
 * @param e
 */
export function showUserMsg(e: AEvent) {
  const UID = e.user_id
  personalInformation(UID, e.user_avatar).then(res => {
    ImageComponent.message(res, UID).then(img => {
      if (typeof img != 'boolean') {
        // 图片发送
        e.reply(img).then(() => {
          // buttons
          Controllers(e).Message.reply(
            'buttons',
            [
              { label: '闭关', value: '/闭关' },
              { label: '出关', value: '/出关' },
              { label: '突破', value: '/突破' }
            ],
            [
              { label: '储物袋', value: '/储物袋' },
              { label: '纳戒', value: '/纳戒' },
              { label: '控制板', value: '/控制板' }
            ]
          )
        })
      }
    })
  })
}

/**
 * 玩家交互状态判断
 * @param e
 * @param UID
 * @param UIDB
 * @returns
 */
export async function dualVerification(
  e: AEvent,
  UserData: UserType,
  UserDataB: UserType
) {
  if (UserData.uid == UserDataB.uid) {
    e.reply(['咦惹'])
    return false
  }
  const { state: stateA, msg: msgA } = await State.goByBlood(UserData)
  if (stateA == 4001) {
    e.reply(msgA)
    return false
  }
  const { state: stateB, msg: msgB } = await State.goByBlood(UserDataB)
  if (stateB == 4001) {
    e.reply([msgB])
    return false
  }
  return true
}

/**
 * 玩家交互地点判断
 * @param e
 * @param region
 * @param regionB
 * @returns
 */
export function dualVerificationAction(
  e: AEvent,
  region: number,
  regionB: number
) {
  if (region != regionB) {
    e.reply(['此地未找到此人'])
    return false
  }
  return true
}

/**
 * 图片消息分发
 * @param e
 * @param msg
 * @returns
 */
export async function sendReply(
  e: AEvent,
  title: string,
  msg: string[] = [],
  size = 8
) {
  // 按每7条消息分组并发送
  for (let i = 0; i < msg.length; i += size) {
    const slicedMsg = msg.slice(i, i + size)
    slicedMsg.unshift(title)
    // 间隔500毫秒发送一组消息
    setTimeout(async () => {
      await e.reply(slicedMsg)
    }, i * 300)
  }
  return
}

/**
 * 无限制控制器
 * @param e
 * @param UID
 * @returns
 */
export async function Control(e: AEvent, UserData: UserType) {
  const { state, msg } = await State.Go(UserData)
  if (state == 4001) {
    e.reply([msg])
    return false
  }
  return true
}

/**
 * 血量控制器
 * @param e
 * @param UID
 * @returns
 */
export async function ControlByBlood(e: AEvent, UserData: UserType) {
  const { state, msg } = await State.goByBlood(UserData)
  if (state == 4001) {
    e.reply([msg])
    return false
  }
  return true
}

/**
 * 地点名控制器
 * @param e
 * @param UID
 * @param addressName
 * @returns
 */
export async function controlByName(
  e: AEvent,
  UserData: UserType,
  addressName: string
) {
  if (!(await ControlByBlood(e, UserData))) return false
  if (!(await Map.mapAction(UserData.pont_x, UserData.pont_y, addressName))) {
    e.reply([`需[(#|/)前往${addressName}]`])
    return false
  }
  return true
}

/**
 * 帮助图发送
 * @param e
 * @param name
 * @returns
 */
export async function postHelp(e: AEvent, name: string) {
  const img = await urlHelpCache(name).catch((err: any) => {
    console.error(err)
    return '图片缓存错误'
  })
  e.reply(img)
  return false
}

const npcName = [
  '巡逻军',
  '城主',
  '柠檬冲水',
  '百里寻晴',
  '联盟',
  '修仙联盟',
  '联盟商会',
  '玄玉天宫',
  '玉贞子',
  '玉炎子',
  '天机门',
  '东方无极'
]

/**
 * 击杀npc
 * @param e
 * @param Mname
 * @param UID
 * @param battle
 * @param BagData
 * @param SpecialData
 * @returns
 */
export async function killNPC(
  e: AEvent,
  Mname: string,
  UID: string,
  prestige: number
) {
  if (!npcName.find(item => Mname.includes(item))) return true

  e.reply(`[${Mname}]:狂妄!`)

  await Users.update(UID, {
    battle_blood_now: 0
  } as UserType)

  // 不触发
  if (!Method.isTrueInRange(1, 100, Math.floor(prestige + 10))) {
    return false
  }

  // 随机去掉一个物品
  const data = await Bag.delThing(UID)
  if (data[0]) {
    // 击碎标记
    await Treasure.add(data[0].name, data[0].type, data[0].acount)
    e.reply(
      [`[${Mname}]击碎了你的的[${data[0].name}]`, `\n你重伤倒地,奄奄一息~`],
      {
        quote: e.msg_id
      }
    )
  } else {
    e.reply([`被[${Mname}]重伤倒地!`])
  }
  return false
}

/**
 * 是否是用户
 * 是用户则返回用户数据
 * @param UID
 * @returns
 */
export async function isUser(UID: string): Promise<UserType> {
  return user.findOne({
    where: {
      uid: UID
    },
    raw: true
  }) as any
}

/**
 * 是否存在用户
 * @param UID
 * @returns
 */
export async function isThereAUserPresent(e: AEvent, UID: string) {
  const UserData = (await user.findOne({
    attributes: ['uid'],
    where: {
      uid: UID
    },
    raw: true
  })) as any
  if (UserData) return true
  e.reply('请先[/踏入仙途]')
  return false
}

/**
 * 对方是否存在
 * @param UID
 * @returns
 */
export async function isThereAUserPresentB(e: AEvent, UID: string) {
  const UserData = await user.findOne({
    attributes: ['uid'],
    where: {
      uid: UID
    },
    raw: true
  })
  if (UserData) return true
  e.reply('查无此人')
  return false
}

export async function victoryCooling(
  e: AEvent,
  UID: string,
  CDID: Burial.CDType
) {
  const { state, msg } = await Burial.cooling(UID, CDID)
  if (state == 4001) {
    e.reply(msg)
    return false
  }
  return true
}

export async function activityCooling(e: AEvent, UID: string, name: string) {
  // 读取活动条件
  const at: ActivityType = (await activity.findOne({
    where: {
      name: name
    },
    raw: true
  })) as any
  // 现在的时间戳
  const time = new Date().getTime()
  // 不在时间之内
  if (time <= at.start_time || time >= at.end_time) {
    e.reply(`${name}已关闭`)
    return false
  }
  // 境界条件不满足
  const gaspractice = await Levels.read(UID, 1).then(item => item.realm)
  const bodypractice = await Levels.read(UID, 2).then(item => item.realm)
  const soul = await Levels.read(UID, 3).then(item => item.realm)
  if (
    gaspractice < at.gaspractice ||
    bodypractice < at.bodypractice ||
    soul < at.soul
  ) {
    e.reply('境界不足')
    return false
  }
  return true
}

export async function activityCoolingNot(UID: string, name: string) {
  // 读取活动条件
  const at: ActivityType = (await activity.findOne({
    where: {
      name: name
    },
    raw: true
  })) as any
  // 现在的时间戳
  const time = new Date().getTime()
  // 不在时间之内
  if (time <= at.start_time || time >= at.end_time) {
    return false
  }
  // 境界条件不满足
  const gaspractice = await Levels.read(UID, 1).then(item => item.realm)
  const bodypractice = await Levels.read(UID, 2).then(item => item.realm)
  const soul = await Levels.read(UID, 3).then(item => item.realm)
  if (
    gaspractice < at.gaspractice ||
    bodypractice < at.bodypractice ||
    soul < at.soul
  ) {
    return false
  }
  return true
}

export async function endAllWord(e: AEvent, UID: string, UserData: UserType) {
  const mapText = {
    1: '只是呆了一会儿',
    2: '走累了,就停一停吧',
    8: '不太专注的放弃了'
  }
  if (!mapText[UserData.state]) {
    setTimeout(() => {
      e.reply(['哎哟', '你干嘛'])
    }, 1000)
    return true
  }
  const startTime = UserData.state_start_time
  let time = Math.floor((new Date().getTime() - startTime) / 60000)
  if (isNaN(time)) time = 10
  if (time <= 1) {
    setTimeout(() => {
      e.reply([`${mapText[UserData.state]}...`])
    }, 1000)
    await State.del(UID)
    return true
  }
  const map = {
    1: async () => {
      //闭关
      await upgrade(e, UID, time, 0, 1, UserData)
    },
    2: async () => {
      // 椴体
      await upgrade(e, UID, time, 1, 2, UserData)
    },
    8: async () => {
      // 聚灵
      await condensateGas(e, UID, time, UserData)
    }
  }
  await map[UserData.state]()
  await State.del(UID)
  return true
}

export async function condensateGas(
  e: AEvent,
  UID: string,
  time: number,
  UserData: UserType
) {
  const size = Math.floor((time * (UserData.talent_size + 100)) / 100)
  const limit = UserData.special_spiritual_limit
  let special_spiritual = UserData.special_spiritual

  special_spiritual += size

  if (special_spiritual >= limit) {
    special_spiritual = limit
  }
  await Users.update(UID, {
    special_spiritual: special_spiritual
  } as UserType)

  setTimeout(() => {
    e.reply([`聚灵成功\n当前灵力${special_spiritual}/${limit}`])
  }, 1000)
}

/**
 *
 * @param e
 * @param UID
 * @param time
 * @param key
 * @param type
 */
export async function upgrade(
  e: AEvent,
  UID: string,
  time: number,
  key: number,
  type: 1 | 2 | 3,
  UserData: UserType
) {
  const config = {
    1: Cooling.work_size,
    0: Cooling.biguan_size
  }
  // 获取数值
  let other = Math.floor(
    (config[key] * time * (UserData.talent_size + 100)) / 100
  )
  // 一定概率减少数值
  if (Math.random() * (100 - 1) + 1 < 20) {
    other -= Math.floor(other / 3)
  }
  // 为nan修正数值
  if (isNaN(other)) {
    other = 1
  }
  const msg: string[] = []
  if (type != 1) {
    msg.push(`锻体凝脉\n[气血]*${other}`)
  } else {
    msg.push(`闭关结束\n[修为]*${other}`)
    // 更新血量
    const blood = await Equipment.addBlood(UserData, time * 10)
    msg.push(`\n[血量]恢复了${time * 10 >= 100 ? 100 : time * 10}%`)
    msg.push(`\n🩸${blood}`)
  }
  // 经验增加
  await Levels.addExperience(UID, type, other)
  setTimeout(() => {
    e.reply(msg, {
      quote: e.msg_id
    })
  }, 1000)
}
