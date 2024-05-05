import { Controllers } from 'alemonjs'
import {
  DB,
  GameApi,
  isThereAUserPresent,
  sendReply,
  victoryCooling,
  Server,
  getSkyComponent
} from '../api/index.js'
import { Messages } from '../alemonjs.js'
const message = new Messages()

message.response(/^(#|\/)?通天塔奖励$/, async e => {
  e.reply('测似乎')
})

message.response(/^(#|\/)?进入通天塔$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return

  /**
   * 查看数据是否存在
   */
  const data: DB.SkyType = (await DB.sky.findOne({
    where: {
      uid: UID
    },
    raw: true
  })) as any

  if (data) {
    e.reply('已进入', {
      quote: e.msg_id
    })

    return
  }

  // 查看奖励
  e.reply(['进入[通天塔]'], {
    quote: e.msg_id
  })

  Controllers(e).Message.reply('', [
    { label: '挑战', value: '/挑战', enter: false },
    { label: '控制板', value: '/控制板' }
  ])

  await DB.sky.create({
    uid: UID
  } as DB.SkyType)
})

message.response(/^(#|\/)?通天塔$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  /**
   * 查看数据是否存在
   */
  const data: DB.SkyType = (await DB.sky.findOne({
    where: {
      uid: UID
    },
    raw: true
  })) as any

  if (!data) {
    e.reply('未进入', {
      quote: e.msg_id
    })

    return
  }
  const img = await getSkyComponent(await Server.showSky(UID), UID)
  if (typeof img != 'boolean') {
    e.reply(img)
    Controllers(e).Message.reply('', [
      { label: '挑战', value: '/挑战', enter: false },
      { label: '控制板', value: '/控制板' }
    ])
  }
})

message.response(/^(#|\/)?挑战\d+$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return

  const CDID = 23,
    CDTime = GameApi.Cooling.CD_B
  if (!(await victoryCooling(e, UID, CDID))) return

  /**
   * 查看数据是否存在
   */
  const data: DB.SkyType = (await DB.sky.findOne({
    where: {
      uid: UID
    },
    raw: true
  })) as any

  if (!data) {
    e.reply('😃未进入', {
      quote: e.msg_id
    })
    return
  }

  const id = Number(e.msg.replace(/^(#|\/)?挑战/, ''))
  if (id >= data.id || id < 1) {
    e.reply('😅你干嘛', {
      quote: e.msg_id
    })
    return
  }

  // 设置redis
  GameApi.Burial.set(UID, CDID, CDTime)

  const dataB: DB.SkyType = (await DB.sky.findOne({
    where: {
      id: id
    },
    raw: true
  })) as any

  // 如果发现找不到。就说明位置是空的，占领位置。
  if (!dataB) {
    await DB.sky.update(
      {
        id
      },
      {
        where: {
          uid: data.uid
        }
      }
    )
    e.reply('位置占领成功')
    return
  }

  const UserDataB: DB.UserType = (await DB.user.findOne({
    where: {
      uid: dataB.uid
    },
    raw: true
  })) as any

  if (!UserDataB) {
    // 不存在该用户了
    await DB.sky.update(
      {
        id
      },
      {
        where: {
          uid: data.uid
        }
      }
    )
    e.reply('位置占领成功')
    return
  }

  const UserData: DB.UserType = (await DB.user.findOne({
    where: {
      uid: UID
    },
    raw: true
  })) as any

  const BMSG = GameApi.Fight.start(UserData, UserDataB)

  // 是否显示战斗结果
  if (UserData.battle_show || UserDataB.battle_show) {
    // 切割战斗信息
    sendReply(e, '[战斗结果]', BMSG.msg)
  }

  if (BMSG.victory == '0') {
    /**
     * 反馈战斗信息
     */
    e.reply('🤪挑战失败,你与对方打成了平手', {
      quote: e.msg_id
    })
    return
  }

  if (BMSG.victory != UID) {
    /**
     * 反馈战斗信息
     */
    e.reply('🤪挑战失败,你被对方击败了', {
      quote: e.msg_id
    })
    return
  }

  await DB.sky.update(
    {
      // 自身的 uid
      uid: data.uid
    },
    {
      where: {
        // 目标 id
        id: dataB.id
      }
    }
  )

  await DB.sky.update(
    {
      // 对方的
      uid: dataB.uid
    },
    {
      where: {
        // 自身的 id
        id: data.id
      }
    }
  )

  e.reply(`😶挑战成功,当前排名${id}`, {
    quote: e.msg_id
  })
})

export default message
