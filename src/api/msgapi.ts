import { Controllers, type AEvent } from 'alemonjs'

// 用户模型
import * as State from '../model/users/base/state.js'
import * as Talent from '../model/users/base/talent.js'
import * as Life from '../model/users/base/life.js'
import * as Users from '../model/users/index.js'
// 附加模型
import * as logs from '../model/users/additional/logs.js'
import * as Skills from '../model/users/additional/skills.js'
import * as Levels from '../model/users/additional/levels.js'
import * as Bag from '../model/users/additional/bag.js'
import * as Ring from '../model/users/additional/ring.js'
import * as Blessing from '../model/users/additional/blessing.js'
import * as Compensate from '../model/users/additional/compensate.js'
import * as Equipment from '../model/users/additional/equipment.js'

// 交易模型
import * as Auction from '../model/system/transaction/auction.js'
import * as Exchange from '../model/system/transaction/exchange.js'
import * as Board from '../model/system/transaction/board.js'
// 特殊机制
import * as Player from '../model/system/player.js'
// 特殊模型
import * as Fight from '../model/system/fight.js'
import * as Monster from '../model/system/monster.js'
import * as Treasure from '../model/system/treasure.js'
import * as explore from '../model/system/explore.js'

// 势力模型
import * as Ass from '../model/system/ass.js'

// 特殊模型
import * as Burial from '../model/wrap/burial.js'
import * as Map from '../model/wrap/map.js'
import * as Place from '../model/wrap/place.js'
import * as Method from '../model/wrap/method.js'
import * as Goods from '../model/wrap/goods.js'
import * as move from '../model/wrap/move.js'

// 配置
import * as Cooling from '../model/config/cooling.js'
import * as Config from '../model/config/index.js'

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
import { updatePlayer } from '../model/system/player.js'

const reStart = {}

/**
 *再入仙途
 * @param e
 * @returns
 */
export async function reCreateMsg(e: AEvent) {
  const UID = e.user_id

  // 确保是用户
  isUser(UID)
    .then(res => {
      if (!res) {
        createUser(e)
        return
      }

      /**
       * 不存在或者过期了
       */
      if (!reStart[UID] || reStart[UID] + 30000 < new Date().getTime()) {
        reStart[UID] = new Date().getTime()
        e.reply(['[重要提示]\n请30s内再次消耗道具', '\n以确认转世'], {
          quote: e.msg_id
        })
        return
      }

      /**
       * 规定时间内操作
       */

      const CDID = 8
      const CDTime = Cooling.CD_Reborn

      /**
       * 检查冷却s
       */
      victoryCooling(e, UID, CDID).then(res => {
        if (!res) return

        /**
         * 重置用户
         */
        Player.updatePlayer(UID, e.user_avatar)
          .then(res => {
            // 设置redis
            Burial.set(UID, CDID, CDTime)

            // 重新查询用户
            isUser(UID)
              .then(UserData => {
                /**
                 * 并发
                 */
                Promise.all([
                  // 更新
                  Equipment.updatePanel(UID, UserData.battle_blood_now),
                  // 更新
                  Skills.updataEfficiency(UID, UserData.talent),
                  // 发送图片
                  showUserMsg(e)
                ])
                // 清除询问
                delete reStart[UID]
              })
              .catch(() => {
                e.reply('数据查询失败')
              })
          })
          .catch(err => {
            e.reply('冷却检查错误')
          })
      })
    })
    .catch(() => {
      e.reply('数据查询失败')
    })
  return
}

/**
 *
 * @param e
 * @param CDID
 * @param ID
 * @param p
 * @returns
 */
export async function levelUp(
  e: AEvent,
  CDID: Burial.CDType,
  ID: 1 | 2 | 3,
  p: number
) {
  const UID = e.user_id

  if (!(await isThereAUserPresent(e, UID))) return

  if (!(await victoryCooling(e, UID, CDID))) return

  const LevelMsg = await Levels.read(UID, ID)
  if (LevelMsg.experience <= 100) {
    e.reply(['毫无自知之明'], {
      quote: e.msg_id
    })
    return
  }
  // 取值范围 [1 100 ] 突破概率为 (68-realm)/100

  const number = LevelMsg.realm ?? 0

  if (!Method.isTrueInRange(1, 100, p - LevelMsg.realm + number)) {
    // 设置突破冷却
    Burial.set(UID, CDID, Cooling.CD_Level_up)
    /** 随机顺序损失经验  */
    const randomKey = Levels.getRandomKey()
    const size = Math.floor(LevelMsg.experience / (randomKey + 1))
    await Levels.reduceExperience(UID, ID, size)
    const msg = await Levels.getCopywriting(
      ID,
      randomKey,
      size > 999999 ? 999999 : size
    )
    e.reply([msg], {
      quote: e.msg_id
    })

    return
  }

  const { msg } = await Levels.enhanceRealm(UID, ID)
  e.reply([msg], {
    quote: e.msg_id
  })

  // 设置
  Burial.set(UID, CDID, Cooling.CD_Level_up)
  setTimeout(async () => {
    const UserData = await Users.read(UID)
    // 更新面板
    Equipment.updatePanel(UID, UserData.battle_blood_now)
  }, 1500)
  return
}

/**
 * 踏入仙途
 */
export function createUser(e: AEvent) {
  const UID = e.user_id
  user
    .findOne({
      attributes: ['uid'],
      where: {
        uid: e.user_id
      },
      raw: true
    })
    .then((res: any) => res as UserType)
    .then(async res => {
      if (!res) {
        // 刷新用户信息
        updatePlayer(UID, e.user_avatar)
          .then(() => {
            // 设置冷却
            Burial.set(UID, 8, Cooling.CD_Reborn)

            if (e.platform == 'ntqq') {
              Controllers(e).Message.reply('', [
                { label: '绑定头像', value: '/绑定头像+QQ', enter: false },
                { label: '修仙帮助', value: '/修仙帮助' },
                { label: '修仙联盟', value: '/前往联盟' }
              ])
            } else {
              e.reply(
                [`修仙大陆第${res.id}位萌新`, '\n发送[/修仙帮助]了解更多'],
                {
                  quote: e.msg_id
                }
              )
            }

            // 显示资料
            showUserMsg(e)
          })
          .catch(err => {
            e.reply(['未寻得仙缘'], {
              quote: e.msg_id
            })
          })
      } else {
        // 显示资料
        showUserMsg(e)
      }
    })
    .catch(err => {
      e.reply('数据查询错误')
    })
}

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
          Controllers(e).Message.reply('', [
            { label: '面板信息', value: '/面板信息' },
            { label: '功法信息', value: '/功法信息' },
            { label: '控制板', value: '/控制板' }
          ])
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
    e.reply([`你没有在这里哦—\n————————\n[/前往${addressName}]`])
    Controllers(e).Message.reply('', [
      { label: `前往${addressName}`, value: `/前往${addressName}` },
      {
        label: '控制板',
        value: '/控制板'
      }
    ])
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
  createUser(e)
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
