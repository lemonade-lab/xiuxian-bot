import { Messages } from 'alemonjs'
import { isThereAUserPresent, endAllWord } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'

const message = new Messages()

message.response(/^(#|\/)?(闭关|閉關)$/, async e => {
  const UID = e.user_id
  //
  if (!(await isThereAUserPresent(e, UID))) return
  //
  const UserData = await GameApi.Users.read(UID)
  // 已经是闭关了
  if (UserData.state == 1) {
    e.reply('闭关中...', {
      quote: e.msg_id
    })
    return
  }
  // 锻体2 聚灵3
  if (UserData.state == 2 || UserData.state == 8) {
    //调用计算
    await endAllWord(e, UID, UserData)
  }
  // 没有调用计算,而是其他行为
  const { state, msg } = await GameApi.State.Go(UserData)
  if (state == 4001) {
    e.reply(msg)
    return
  }
  setTimeout(async () => {
    await GameApi.State.set(UID, {
      actionID: 1,
      startTime: new Date().getTime(), // 记录了现在的时间
      endTime: 9999999999999 // 结束时间应该是无限的
    })
    e.reply(['开始两耳不闻窗外事...'], {
      quote: e.msg_id
    })
  }, 2000)
  return
})

message.response(/^(#|\/)?(锻体|降妖)$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  if (UserData.state == 2) {
    e.reply('锻体中...', {
      quote: e.msg_id
    })
    return
  }
  if (UserData.state == 1 || UserData.state == 8) {
    //调用计算
    await endAllWord(e, UID, UserData)
  }
  // 其他状态
  const { state, msg } = await GameApi.State.Go(UserData)
  if (state == 4001) {
    e.reply(msg)
    return
  }
  setTimeout(async () => {
    await GameApi.State.set(UID, {
      actionID: 2,
      startTime: new Date().getTime(), // 记录了现在的时间
      endTime: 9999999999999
    })
    e.reply(['开始爬山越岭,负重前行...'], {
      quote: e.msg_id
    })
  }, 2000)
  return
})

message.response(/^(#|\/)?打坐$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  // 已经是打坐了
  if (UserData.state == 8) {
    e.reply('打坐中...', {
      quote: e.msg_id
    })
    return
  }
  // 如果是 闭关 和 降妖
  if (UserData.state == 1 || UserData.state == 2) {
    // 调用计算
    await endAllWord(e, UID, UserData)
  }
  // 没有调用计算,而是其他行为
  const { state, msg } = await GameApi.State.Go(UserData)
  if (state == 4001) {
    e.reply(msg)
    return
  }
  // 切换为打坐
  setTimeout(async () => {
    await GameApi.State.set(UID, {
      actionID: 8,
      startTime: new Date().getTime(), // 记录了现在的时间
      endTime: 9999999999999
    })
    e.reply(['开始吐纳灵气...'], {
      quote: e.msg_id
    })
  }, 2000)
  return
})

message.response(/^(#|\/)?(归来|歸來|凝脉|出关|出關|聚灵|聚靈)$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  endAllWord(e, UID, UserData)
  return
})

export const ControlPlayer = message.ok
