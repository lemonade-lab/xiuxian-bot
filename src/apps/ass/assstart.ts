import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import * as DB from 'xiuxian-db'
import { Messages } from 'alemonjs'

const delCooling = {}
const exiteCooling = {}

const message = new Messages()

message.response(/^(#|\/)?建立[\u4e00-\u9fa5]+$/, async e => {
  const UID = e.user_id

  if (!(await isThereAUserPresent(e, UID))) return

  /**
   * *****
   * 境界拦截
   */
  const gaspractice = await GameApi.Levels.read(UID, 1).then(item => item.realm)
  if (gaspractice <= GameApi.Cooling.AssLevel) {
    e.reply('境界不足', {
      quote: e.msg_id
    })

    return false
  }

  /**
   * *******
   * 已拥有查询
   */
  const UserAss = await DB.user_ass
    .findOne({
      where: {
        uid: UID,
        identity: GameApi.Config.ASS_IDENTITY_MAP['0']
      }
    })
    .then(res => res?.dataValues)
  if (UserAss) {
    e.reply('已创立个人势力', {
      quote: e.msg_id
    })

    return
  }

  const NAME = e.msg.replace(/^(#|\/)?建立/, '')

  const typing = NAME.match(/.$/)[0]

  if (
    !Object.prototype.hasOwnProperty.call(GameApi.Config.ASS_TYPING_MAP, typing)
  ) {
    e.reply([
      '该类型势力不可建立:',
      typing,
      '\n仅可建立(宗|派|门|峰|教|谷|洞|阁|组|堡|城|宫|国|会)'
    ])

    return
  }

  /**
   * ********
   * 存在该昵称的宗门
   */
  const aData = await DB.ass
    .findOne({
      where: {
        name: NAME
      }
    })
    .then(res => res?.dataValues)
  if (aData) {
    e.reply('该势力已存在', {
      quote: e.msg_id
    })

    return
  }

  /**
   * ************
   * 灵石拦截
   */
  const lingshi = await GameApi.Bag.searchBagByName(UID, '下品灵石')

  const number = GameApi.Cooling.AssNumer

  // // 灵石不够
  if (!lingshi || lingshi.acount < number) {
    e.reply([`\n需要确保拥有[下品灵石]*${number}`], {
      quote: e.msg_id
    })

    return
  } else {
    e.reply([`扣除[下品灵石]*${number}`], {
      quote: e.msg_id
    })
  }

  /**
   * ********
   * 扣除灵石
   */
  await GameApi.Bag.reduceBagThing(UID, [
    {
      name: '下品灵石',
      acount: number
    }
  ])

  /**
   * *********
   * 创建势力
   */
  await DB.ass
    .create({
      create_time: new Date().getTime(),
      name: NAME,
      property: number, // 储蓄
      typing: GameApi.Config.ASS_TYPING_MAP[typing] // 类型
    })
    .then(async res => {
      const aData = await DB.ass
        .findOne({
          where: {
            name: NAME
          }
        })
        .then(res => res?.dataValues)
      if (!aData) {
        e.reply('创建失败', {
          quote: e.msg_id
        })

        return
      }
      // 创建存档
      await DB.user_ass.create({
        create_tiime: new Date().getTime(),
        uid: UID,
        aid: aData.id, // 并不知道id
        authentication: 0,
        identity: GameApi.Config.ASS_IDENTITY_MAP['0']
      })
      e.reply(['成功建立', NAME], {
        quote: e.msg_id
      })
    })

  return
})

message.response(/^(#|\/)?解散$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return

  // 查看自己的宗门
  const UserAss = await DB.user_ass
    .findOne({
      where: {
        uid: UID, // uid
        identity: GameApi.Config.ASS_IDENTITY_MAP['0'] // 身份
      }
    })
    .then(res => res?.dataValues)
  if (!UserAss) {
    e.reply('未创立个人势力', {
      quote: e.msg_id
    })

    return
  }

  // 不存在 或者过期了
  if (!delCooling[UID] || delCooling[UID] + 30000 < new Date().getTime()) {
    delCooling[UID] = new Date().getTime()
    e.reply(
      [
        '[重要提示]',
        '\n解散将清除所有数据且不可恢复',
        '\n请30s内再次发送',
        '\n[/解散]',
        '\n以确认解散'
      ],
      {
        quote: e.msg_id
      }
    )
    return
  }

  const id = UserAss.aid

  // 删除所有 aid的记录
  await DB.user_ass.destroy({
    where: {
      aid: id
    }
  })

  // 删除所有aid记录

  await DB.ass_bag.destroy({
    where: {
      aid: id
    }
  })

  // 删除id
  await DB.ass.destroy({
    where: {
      id: id
    }
  })

  e.reply(['成功解散'], {
    quote: e.msg_id
  })
  return
})

message.response(/^(#|\/)?加入[\u4e00-\u9fa5]+$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  /**
   * 查看是否是主人
   */
  const UserAss = await DB.user_ass
    .findOne({
      where: {
        uid: UID,
        identity: GameApi.Config.ASS_IDENTITY_MAP['0']
      }
    })
    .then(res => res?.dataValues)
  if (UserAss) {
    e.reply('已创立个人势力', {
      quote: e.msg_id
    })
    return
  }

  /**
   * 加入xxx
   */
  const name = e.msg.replace(/^(#|\/)?加入/, '')

  /**
   * ********
   * 存在该昵称的宗门
   */
  const aData = await DB.ass
    .findOne({
      where: {
        name: name
      }
    })
    .then(res => res?.dataValues)

  if (!aData) {
    e.reply('该势力不存在', {
      quote: e.msg_id
    })
    return
  }
  /**
   * 检测是否已提交申请
   */
  const joinData = await DB.user_ass
    .findOne({
      where: {
        uid: UID,
        aid: aData.id,
        identity: GameApi.Config.ASS_IDENTITY_MAP['9']
      }
    })
    .then(res => res?.dataValues)
  if (joinData) {
    e.reply('已提交申请,请勿重复提交', {
      quote: e.msg_id
    })
    return
  }

  /**
   * 创建信息条目
   */
  await DB.user_ass.create({
    create_tiime: new Date().getTime(),
    uid: UID,
    aid: aData.id,
    authentication: 9,
    identity: GameApi.Config.ASS_IDENTITY_MAP['9']
  })

  e.reply('已提交申请', {
    quote: e.msg_id
  })
  return
})

message.response(/^(#|\/)?退出[\u4e00-\u9fa5]+$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return

  const name = e.msg.replace(/^(#|\/)?退出/, '')

  /**
   * ********
   * 存在该昵称的宗门
   */
  const aData = await DB.ass
    .findOne({
      where: {
        name: name
      }
    })
    .then(res => res?.dataValues)
  if (!aData) {
    e.reply('该势力不存在', {
      quote: e.msg_id
    })
    return
  }

  /**
   * ******
   * 查看是否是主人
   */
  const UserAss = await DB.user_ass
    .findOne({
      where: {
        uid: UID,
        aid: aData.id,
        identity: GameApi.Config.ASS_IDENTITY_MAP['0']
      }
    })
    .then(res => res?.dataValues)
  if (UserAss) {
    e.reply('个人势力不可退出', {
      quote: e.msg_id
    })
    return
  }

  // 不存在 或者过期了
  if (!exiteCooling[UID] || exiteCooling[UID] + 30000 < new Date().getTime()) {
    exiteCooling[UID] = new Date().getTime()
    e.reply(['[重要提示]', '\n请30s内再次发送', '\n以确认退出'], {
      quote: e.msg_id
    })
    return
  }

  await DB.user_ass
    .destroy({
      where: {
        uid: UID,
        aid: aData.id
      }
    })
    .then(() => {
      e.reply('已退出' + name, {
        quote: e.msg_id
      })
    })
})

export const AssStarts = message.ok
