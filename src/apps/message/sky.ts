import { Controllers, Messages } from 'alemonjs'
import {
  GameApi,
  isThereAUserPresent,
  sendReply,
  victoryCooling
} from 'xiuxian-api'
import { getSkyComponent } from 'xiuxian-component'
import * as DB from 'xiuxian-db'
import { skys, user_skys } from 'xiuxian-db'
import { Op } from 'sequelize'
import { Users, Bag } from 'xiuxian-core'
import { showSky } from 'xiuxian-statistics'
const message = new Messages()
message.response(/^(#|\/)?通天塔奖励$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  // 查看数据是否存在
  const data = await DB.sky
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)
  if (!data) {
    e.reply('未已进入', {
      quote: e.msg_id
    })
    return
  }
  if (data.id > 50) {
    e.reply('最低奖励需排名50')
    return
  }
  // 国际时间
  const currentDate = new Date()
  currentDate.setDate(1)
  currentDate.setHours(0, 0, 0, 0)
  // 北京时间
  // const currentDate = new Date()
  // currentDate.setDate(1)
  // currentDate.setHours(8, 0, 0, 0)
  const uDAta = await user_skys
    .findAll({
      where: {
        uid: UID,
        time: currentDate
      }
    })
    .then(res => res.map(item => item.dataValues))

  // 领取记录
  const ids = uDAta.map(item => item.sid)
  // 找到 比 比排名少的数据。 并一次检查记录中，是否存在领取记录。
  const sData = await skys
    .findAll({
      where: {
        ranking: {
          [Op.gte]: data.id
        }
      }
    })
    .then(res => res.map(item => item.dataValues))
  const sData2 = sData.filter(item => {
    // 存在
    if (ids.includes(item.id)) {
      return false
    } else {
      return true
    }
  })
  const goods = sData2.map(item => ({
    id: item.id,
    name: item.name,
    acount: item.count
  }))
  const UserData = await Users.read(UID)
  const BagSize = await Bag.backpackFull(UID, UserData.bag_grade)
  // 背包未位置了直接返回了
  if (!BagSize) {
    e.reply(['储物袋空间不足'], {
      quote: e.msg_id
    })
    return
  }
  const msg = ['领取物品']
  for (const item of goods) {
    await user_skys.create({
      uid: UID,
      // 对应奖励条
      time: currentDate,
      sid: item.id,
      createAt: new Date()
    })
    msg.push(`[${item.name}]*${item.acount}`)
  }
  await Bag.addBagThing(UID, UserData.bag_grade, goods)
  if (msg.length <= 1) {
    e.reply('此排名奖励本月已无法领取')
  } else {
    e.reply(msg.join(''))
  }
})
message.response(/^(#|\/)?进入通天塔$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  //查看数据是否存在
  const data = await DB.sky
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)

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
    { label: '奖励', value: '/通天塔奖励' },
    { label: '挑战', value: '/挑战', enter: false },
    { label: '控制板', value: '/控制板' }
  ])
  await DB.sky.create({
    uid: UID
  })
})
message.response(/^(#|\/)?通天塔$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  // 查看数据是否存在
  const data = await DB.sky
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)

  if (!data) {
    e.reply('未进入', {
      quote: e.msg_id
    })

    return
  }
  const img = await getSkyComponent(await showSky(UID), UID)
  if (typeof img != 'boolean') {
    e.reply(img)
    Controllers(e).Message.reply('', [
      { label: '奖励', value: '/通天塔奖励' },
      { label: '挑战', value: '/挑战', enter: false },
      { label: '控制板', value: '/控制板' }
    ])
  }
})
message.response(/^(#|\/)?挑战\d+$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const CDID = 23
  const CDTime = GameApi.Cooling.CD_B
  if (!(await victoryCooling(e, UID, CDID))) return
  // 查看数据是否存在
  const data = await DB.sky
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)
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
  const dataB = await DB.sky
    .findOne({
      where: {
        id: id
      }
    })
    .then(res => res.dataValues)
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
  const UserDataB = await DB.user
    .findOne({
      where: {
        uid: dataB.uid
      }
    })
    .then(res => res.dataValues)
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
  const UserData = await DB.user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)
  const BMSG = GameApi.Fight.start(UserData, UserDataB)
  // 是否显示战斗结果
  if (UserData.battle_show || UserDataB.battle_show) {
    // 切割战斗信息
    sendReply(e, '[战斗结果]', BMSG.msg)
  }
  if (BMSG.victory == '0') {
    // 反馈战斗信息
    e.reply('🤪挑战失败,你与对方打成了平手', {
      quote: e.msg_id
    })
    return
  }
  if (BMSG.victory != UID) {
    // 反馈战斗信息
    e.reply('🤪挑战失败,你被对方击败了', {
      quote: e.msg_id
    })
    return
  }
  //
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
  //
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
  //
  e.reply(`😶挑战成功,当前排名${id}`, {
    quote: e.msg_id
  })
})

export const Sky = message.ok
