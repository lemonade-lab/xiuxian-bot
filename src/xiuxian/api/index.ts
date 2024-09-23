import { user, user_level } from 'xiuxian-db'
import {
  Cooling,
  Method,
  Map,
  Burial,
  Treasure,
  Player,
  State,
  Skills,
  Levels,
  Bag,
  Equipment
} from 'xiuxian-core'
import { urlHelpCache } from 'xiuxian-utils'
import { personalInformation } from 'xiuxian-statistics'
import { pictureRender } from 'xiuxian-img'
import { Image, Text, useSend } from 'alemonjs'

const reStart = {}

/**
 *再入仙途
 * @param e
 * @returns
 */
export async function reCreateMsg(e) {
  const UID = e.UserId

  const Send = useSend(e)

  // 确保是用户
  user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)
    .then(res => {
      // 不存在
      if (!res) {
        createUser(e)
        return
      }

      /**
       * 不存在或者过期了
       */
      if (!reStart[UID] || reStart[UID] + 30000 < new Date().getTime()) {
        reStart[UID] = new Date().getTime()
        Send(Text('再次消耗道具\n以确认转世'))
        return
      }

      /**
       * 规定时间内操作
       */

      const CDID = 8
      const CDTime = Cooling.CD_Reborn

      // Burial.del(UID, CDID)

      /**
       * 检查冷却s
       */
      victoryCooling(e, UID, CDID).then(res => {
        if (!res) return

        /**
         * 重置用户
         */
        Player.updatePlayer(UID, e.UserAvatar)
          .then(_ => {
            // 设置redis
            Burial.set(UID, CDID, CDTime)

            // 重新查询用户
            user
              .findOne({
                where: {
                  uid: UID
                }
              })
              .then(res => res?.dataValues)
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
                Send(Text('数据查询失败'))
              })
          })
          .catch(_ => {
            Send(Text('未寻得仙缘'))
          })
      })
    })
    .catch(err => {
      console.error(err)
      Send(Text('数据查询失败'))
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
  e,
  CDID: Burial.CDType,
  ID: 1 | 2 | 3,
  p: number
) {
  const UID = e.UserId

  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return

  if (!(await victoryCooling(e, UID, CDID))) return

  const LevelMsg = await user_level
    .findOne({
      attributes: ['addition', 'realm', 'experience'],
      where: {
        uid: UID,
        type: ID
      }
    })
    .then(res => res?.dataValues)
  const Send = useSend(e)
  if (LevelMsg.experience <= 100) {
    Send(Text('毫无自知之明'))
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
    Send(Text(msg))
    return
  }

  const { msg } = await Levels.enhanceRealm(UID, ID)

  Send(Text(msg))

  // 设置
  Burial.set(UID, CDID, Cooling.CD_Level_up)
  setTimeout(async () => {
    const UserData = await user
      .findOne({ where: { uid: UID } })
      .then(res => res?.dataValues)
    // 更新面板
    Equipment.updatePanel(UID, UserData.battle_blood_now)
  }, 1500)
  return
}

/**
 * 踏入仙途
 */
export function createUser(e) {
  const UID = e.UserId
  const Send = useSend(e)
  // 刷新用户信息
  Player.updatePlayer(UID, e.UserAvatar)
    .then(() => {
      // 设置冷却
      Burial.set(UID, 8, Cooling.CD_Reborn)
      Send(Text('欢迎萌新\n发送[/修仙帮助]了解更多'))
      // 显示资料
      showUserMsg(e)
    })
    .catch(err => {
      console.error(err)
      Send(Text('未寻得仙缘'))
    })
}

/**
 * 显示个人信息
 * @param e
 */
export function showUserMsg(e) {
  const UID = e.UserId
  const Send = useSend(e)
  personalInformation(UID, e.UserAvatar).then(UserData => {
    pictureRender('MessageComponent', {
      name: UID,
      props: {
        data: UserData,
        theme: UserData?.theme ?? 'dark'
      }
    }).then(img => {
      if (typeof img != 'boolean') {
        // 图片发送
        Send(Image(img))
      } else {
        //
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
export async function dualVerification(e: {}, UserData, UserDataB) {
  const Send = useSend(e)
  if (UserData.uid == UserDataB.uid) {
    Send(Text('自己打自己?'))
    return false
  }
  const { state: stateA, msg: msgA } = await State.goByBlood(UserData)
  if (stateA == 4001) {
    Send(Text(msgA))
    return false
  }
  const { state: stateB, msg: msgB } = await State.goByBlood(UserDataB)
  if (stateB == 4001) {
    Send(Text(msgB))
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
export function dualVerificationAction(e: {}, region: number, regionB: number) {
  if (region != regionB) {
    const Send = useSend(e)
    Send(Text('此地未找到此人'))
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
  e: {},
  title: string,
  msg: string[] = [],
  size = 8
) {
  // 按每7条消息分组并发送
  const Send = useSend(e)
  for (let i = 0; i < msg.length; i += size) {
    const slicedMsg = msg.slice(i, i + size)
    slicedMsg.unshift(title)
    // 间隔500毫秒发送一组消息
    setTimeout(() => {
      Send(Text(slicedMsg.join('\n')))
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
export async function Control(e: {}, UserData) {
  const { state, msg } = await State.Go(UserData)
  const Send = useSend(e)
  if (state == 4001) {
    Send(Text(msg))
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
export async function ControlByBlood(e: {}, UserData) {
  const { state, msg } = await State.goByBlood(UserData)
  const Send = useSend(e)
  if (state == 4001) {
    Send(Text(msg))
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
export async function controlByName(e: {}, UserData, addressName: string) {
  if (!(await ControlByBlood(e, UserData))) return false
  if (!(await Map.mapAction(UserData.pont_x, UserData.pont_y, addressName))) {
    const Send = useSend(e)
    Send(Text(`你没有在这里哦！\n————————\n[/前往${addressName}]`))
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
export async function postHelp(e: {}, name: string) {
  const img = await urlHelpCache(name).catch((err: any) => {
    console.error(err)
    return '图片缓存错误'
  })
  const Send = useSend(e)
  if (typeof img === 'string') {
    //
  } else {
    Send(Image(img))
  }
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
  e: {},
  Mname: string,
  UID: string,
  prestige: number
) {
  if (!npcName.find(item => Mname.includes(item))) return true

  const Send = useSend(e)

  Send(Text(`[${Mname}]:狂妄!`))

  await user.update(
    {
      battle_blood_now: 0
    },
    {
      where: {
        uid: UID
      }
    }
  )

  Send(Text(`你被[${Mname}]重伤倒地!`))

  // 不触发
  if (!Method.isTrueInRange(1, 100, Math.floor(prestige + 10))) {
    return false
  }

  // 随机去掉一个物品
  const data = await Bag.delThing(UID)

  // 存在物品
  if (data[0]) {
    // 击碎标记
    await Treasure.add(data[0].name, data[0].type, data[0].acount)
    Send(Text(`[${Mname}]击碎了你的的[${data[0].name}]`))
  }

  //
  return false
}

export async function showAction(e: {}, UID: string, UserData) {
  const mData = await Map.getRecordsByXYZ(
    UserData.pont_x,
    UserData.pont_y,
    UserData.pont_z
  )
  if (mData) {
    await user.update(
      {
        point_type: mData.type,
        pont_attribute: mData.attribute,
        pont_x: UserData.pont_x,
        pont_y: UserData.pont_y,
        pont_z: UserData.pont_z
      },
      {
        where: {
          uid: UID
        }
      }
    )
    const Send = useSend(e)
    Send(Text(`(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`))
  }
  return
}

/**
 * 是否存在用户
 * @param UID
 * @returns
 */
export async function isUser(e: {}, UID: string) {
  const UserData = await user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)
    .catch(_ => false)
  if (typeof UserData !== 'boolean') return UserData
  createUser(e)
  return false
}

/**
 * 对方是否存在
 * @param UID
 * @returns
 */
export async function isSideUser(e: {}, UID: string) {
  const UserData = await user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)
    .catch(_ => false)
  if (typeof UserData !== 'boolean') return UserData
  const Send = useSend(e)
  Send(Text('查无此人'))
  return false
}

export async function victoryCooling(e: {}, UID: string, CDID: Burial.CDType) {
  const { state, msg } = await Burial.cooling(UID, CDID)
  if (state == 4001) {
    const Send = useSend(e)
    Send(Text(msg))
    return false
  }
  return true
}

export async function endAllWord(
  e: {},
  UID: string,
  UserData: {
    state: number
    state_start_time: number
  }
) {
  const mapText = {
    1: '只是呆了一会儿',
    2: '走累了,就停一停吧',
    8: '不太专注的放弃了'
  }
  const Send = useSend(e)
  if (!mapText[UserData.state]) {
    setTimeout(() => {
      Send(Text('哎哟,你干嘛'))
    }, 1000)
    return true
  }
  const startTime = UserData.state_start_time
  let time = Math.floor((new Date().getTime() - startTime) / 60000)
  if (isNaN(time)) time = 10
  if (time <= 1) {
    setTimeout(() => {
      Send(Text(`${mapText[UserData.state]}...`))
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
  e: {},
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
  await user.update(
    {
      special_spiritual: special_spiritual
    },
    {
      where: {
        uid: UID
      }
    }
  )
  setTimeout(() => {
    const Send = useSend(e)
    Send(Text(`聚灵成功\n当前灵力${special_spiritual}/${limit}`))
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
  e: {},
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
    const Send = useSend(e)
    Send(Text(msg.join('')))
  }, 1000)
}

/**
 * 渡劫失败惩罚
 * @param e
 * @param UID
 * @param size
 * @returns
 */
export async function punishLevel(e: {}, UID: string, UserData) {
  /**
   * 渡劫失败惩罚
   *
   * 20%*灵根数 -5%*变异灵根数 = 成功概率
   * 五 100%   掉经验+清血量+概率掉物品
   * 四 80%    掉境界+掉经验+清血量
   * 三 60%    所有境界掉1级+所有经验清空+清血量
   * 二 40%    所有境界掉3级+所有经验清空+清血量
   * 一 20%    死亡+清血量
   */

  // 得到用户数据
  const Userexp = await user_level
    .findOne({
      attributes: ['addition', 'realm', 'experience'],
      where: {
        uid: UID,
        type: 1
      }
    })
    .then(res => res?.dataValues)
  //
  const Userbool = await user_level
    .findOne({
      attributes: ['addition', 'realm', 'experience'],
      where: {
        uid: UID,
        type: 2
      }
    })
    .then(res => res?.dataValues)
  //
  const Usershen = await user_level
    .findOne({
      attributes: ['addition', 'realm', 'experience'],
      where: {
        uid: UID,
        type: 3
      }
    })
    .then(res => res?.dataValues)

  await user.update(
    { battle_blood_now: 0 },
    {
      where: {
        uid: UID
      }
    }
  )

  const Send = useSend(e)

  switch (UserData.talent.length) {
    case 1: {
      setTimeout(async () => {
        user_level.update({ experience: 0 }, { where: { uid: UID, type: 1 } })
        user_level.update({ experience: 0 }, { where: { uid: UID, type: 2 } })
        user_level.update({ experience: 0 }, { where: { uid: UID, type: 3 } })
        Send(Text('[灭世之雷]击中了你的道韵,修为清空,化作尘埃'))
      }, 6000)
      break
    }
    case 2: {
      setTimeout(async () => {
        user_level.update(
          { experience: Math.floor(Userexp.experience * 0.75) },
          { where: { uid: UID, type: 1 } }
        )
        user_level.update(
          { experience: Math.floor(Userbool.experience * 0.75) },
          { where: { uid: UID, type: 2 } }
        )
        user_level.update(
          { experience: Math.floor(Usershen.experience * 0.75) },
          { where: { uid: UID, type: 3 } }
        )
        Send(Text('[灭世之雷]击中了你的道韵,损失部分修为'))
      }, 6000)
      break
    }
    case 3: {
      setTimeout(async () => {
        user_level.update(
          { experience: Math.floor(Userexp.experience * 0.5) },
          { where: { uid: UID, type: 1 } }
        )
        user_level.update(
          { experience: Math.floor(Userbool.experience * 0.5) },
          { where: { uid: UID, type: 2 } }
        )
        user_level.update(
          { experience: Math.floor(Usershen.experience * 0.5) },
          { where: { uid: UID, type: 3 } }
        )
        Send(Text('[灭世之雷]击中了你的道韵,损失一半修为'))
      }, 6000)
      break
    }
    case 4: {
      setTimeout(async () => {
        user_level.update(
          { experience: Math.floor(Userexp.experience * 0.25) },
          { where: { uid: UID, type: 1 } }
        )
        user_level.update(
          { experience: Math.floor(Userbool.experience * 0.25) },
          { where: { uid: UID, type: 2 } }
        )
        user_level.update(
          { experience: Math.floor(Usershen.experience * 0.25) },
          { where: { uid: UID, type: 3 } }
        )
        Levels.fallingRealm(UID, 1)
        Send(Text['[灭世之雷]击中了你的道韵,损失部分修为'])
      }, 6000)
      break
    }
    case 5: {
      setTimeout(async () => {
        user_level.update(
          { experience: Math.floor(Userexp.experience * 0.15) },
          { where: { uid: UID, type: 1 } }
        )
        user_level.update(
          { experience: Math.floor(Userbool.experience * 0.15) },
          { where: { uid: UID, type: 2 } }
        )
        user_level.update(
          { experience: Math.floor(Usershen.experience * 0.15) },
          { where: { uid: UID, type: 3 } }
        )
        Levels.fallingRealm(UID, 1)
        Send(Text('[灭世之雷]击中了你的道韵,损失部分修为'))
      }, 6000)
      break
    }
  }
}
