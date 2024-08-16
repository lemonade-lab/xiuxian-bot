import { type AEvent } from 'alemonjs'
import { ERROE_CODE, OK_CODE } from '../config/ajax'
import { user } from 'xiuxian-db'
import Application from 'koa'
import {
  Cooling,
  Method,
  Map,
  Burial,
  Treasure,
  State,
  Users,
  Levels,
  Bag,
  Equipment
} from 'xiuxian-core'

/**
 *
 * @param e
 * @param CDID
 * @param ID
 * @param p
 * @returns
 */
export async function levelUp(
  ctx: Application.ParameterizedContext,
  CDID: Burial.CDType,
  ID: 1 | 2 | 3,
  p: number
) {
  const UID = ctx.state.user.id

  if (!(await isThereAUserPresent(UID))) return

  if (!(await victoryCooling(ctx, UID, CDID))) return

  const LevelMsg = await Levels.read(UID, ID)
  if (LevelMsg.experience <= 100) {
    ctx.body = {
      code: OK_CODE,
      msg: '毫无自知之明',
      data: null
    }
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
    ctx.body = {
      code: OK_CODE,
      msg: msg,
      data: null
    }

    return
  }

  const { msg } = await Levels.enhanceRealm(UID, ID)
  ctx.body = {
    code: OK_CODE,
    msg: msg,
    data: null
  }

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
 * 显示个人信息
 * @param e
 */
export async function showUserMsg(ctx: Application.Context) {
  const UID = ctx.state.user.uid
  await user
    .findOne({
      where: {
        uid: UID
      },
      raw: true
    })
    .then((res: any) => res)
    .then(res => {
      if (res) {
        ctx.body = {
          code: OK_CODE,
          msg: '查询成功',
          data: res
        }
        return
      }
      ctx.body = {
        code: ERROE_CODE,
        msg: '查询错误',
        data: null
      }
    })
    .catch(err => {
      console.log(err)
      ctx.body = {
        code: ERROE_CODE,
        msg: '服务器错误',
        data: null
      }
    })
  return
}

/**
 * 玩家交互状态判断
 * @param e
 * @param UID
 * @param UIDB
 * @returns
 */
export async function dualVerification(e: AEvent, UserData, UserDataB) {
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
export async function Control(e: AEvent, UserData) {
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
export async function ControlByBlood(e: AEvent, UserData) {
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
export async function controlByName(e: AEvent, UserData, addressName: string) {
  if (!(await ControlByBlood(e, UserData))) return false
  if (!(await Map.mapAction(UserData.pont_x, UserData.pont_y, addressName))) {
    e.reply([`你没有在这里哦—\n————————\n[/前往${addressName}]`])
    return false
  }
  return true
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
  })

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
export async function isUser(UID: string) {
  return user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)
}

/**
 * 是否存在用户
 * @param UID
 * @returns
 */
export async function isThereAUserPresent(UID: string) {
  const UserData = (await user.findOne({
    attributes: ['uid'],
    where: {
      uid: UID
    },
    raw: true
  })) as any
  if (UserData) return true
  return false
}

/**
 * 对方是否存在
 * @param UID
 * @returns
 */
export async function isThereAUserPresentB(UID: string) {
  const UserData = await user.findOne({
    attributes: ['uid'],
    where: {
      uid: UID
    },
    raw: true
  })
  if (UserData) return true
  return false
}

export async function victoryCooling(
  ctx: Application.ParameterizedContext,
  UID: string,
  CDID: Burial.CDType
) {
  const { state, msg } = await Burial.cooling(UID, CDID)
  if (state == 4001) {
    ctx.body = {
      code: ERROE_CODE,
      msg: msg,
      data: null
    }
    return false
  }
  return true
}

export async function endAllWord(e: AEvent, UID: string, UserData) {
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
      e.reply([`${mapText[UserData.state]}../../src.`])
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
  UserData
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
  })

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
  UserData
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
