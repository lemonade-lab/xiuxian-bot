import koaRouter from 'koa-router'
import { UserType, user } from '../../../src/db/models.js'
import { goByBlood } from '../../../src/model/users/base/state.js'
import { GameApi } from '../../../src/api/index.js'
import * as Burial from '../../../src/model/wrap/burial.js'
import * as Users from '../../../src/model/users/index.js'
import * as Method from '../../../src/model/wrap/method.js'
import * as Bag from '../../../src/model/users/additional/bag.js'
import { DB } from '../../../src/api/index.js'
import { ERROE_CODE, OK_CODE } from '../../config/ajax'
const router = new koaRouter({ prefix: '/api/v1/move' })

//个人位置
router.get('/xyzaddress', async ctx => {
  const UID = ctx.state.user.uid
  const UserData1 = (await user.findOne({
    where: {
      uid: UID
    }
  })) as any
  //判断用户是否存在
  if (!UserData1) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '查询错误',
      data: null
    }
    return
  }
  const UserData = await GameApi.Users.read(UID)
  ctx.body = {
    code: OK_CODE,
    msg: `坐标(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`,
    data: null
  }
  return
})
//上
router.get('/mapW', async ctx => {
  const UID = ctx.state.user.uid
  const UserData1 = (await user.findOne({
    where: {
      uid: UID
    }
  })) as any
  //判断用户是否存在
  if (!UserData1) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '查询错误',
      data: null
    }
    return
  }
  const UserData = await GameApi.Users.read(UID)
  const { state, msg } = await goByBlood(UserData)
  if (state == 4001) {
    ctx.body = {
      code: ERROE_CODE,
      msg: msg,
      data: null
    }
  }
  UserData.pont_y += 10
  const mData = await GameApi.Map.getRecordsByXYZ(
    UserData.pont_x,
    UserData.pont_y,
    UserData.pont_z
  )
  if (mData) {
    await GameApi.Users.update(UID, {
      point_type: mData.type,
      pont_attribute: mData.attribute,
      pont_x: UserData.pont_x,
      pont_y: UserData.pont_y,
      pont_z: UserData.pont_z
    } as DB.UserType)
  }
  ctx.body = {
    code: OK_CODE,
    msg: `坐标(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`,
    data: null
  }
  return
})
//下
router.get('/mapS', async ctx => {
  const UID = ctx.state.user.uid
  const UserData1 = (await user.findOne({
    where: {
      uid: UID
    }
  })) as any
  //判断用户是否存在
  if (!UserData1) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '查询错误',
      data: null
    }
    return
  }
  const UserData = await GameApi.Users.read(UID)
  const { state, msg } = await goByBlood(UserData)
  if (state == 4001) {
    ctx.body = {
      code: ERROE_CODE,
      msg: msg,
      data: null
    }
  }
  UserData.pont_y -= 10
  const mData = await GameApi.Map.getRecordsByXYZ(
    UserData.pont_x,
    UserData.pont_y,
    UserData.pont_z
  )
  if (mData) {
    await GameApi.Users.update(UID, {
      point_type: mData.type,
      pont_attribute: mData.attribute,
      pont_x: UserData.pont_x,
      pont_y: UserData.pont_y,
      pont_z: UserData.pont_z
    } as DB.UserType)
  }
  ctx.body = {
    code: OK_CODE,
    msg: `坐标(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`,
    data: null
  }
  return
})
//左
router.get('/mapA', async ctx => {
  const UID = ctx.state.user.uid
  const UserData1 = (await user.findOne({
    where: {
      uid: UID
    }
  })) as any
  //判断用户是否存在
  if (!UserData1) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '查询错误',
      data: null
    }
    return
  }
  const UserData = await GameApi.Users.read(UID)
  const { state, msg } = await goByBlood(UserData)
  if (state == 4001) {
    ctx.body = {
      code: ERROE_CODE,
      msg: msg,
      data: null
    }
  }
  UserData.pont_x -= 10
  const mData = await GameApi.Map.getRecordsByXYZ(
    UserData.pont_x,
    UserData.pont_y,
    UserData.pont_z
  )
  if (mData) {
    await GameApi.Users.update(UID, {
      point_type: mData.type,
      pont_attribute: mData.attribute,
      pont_x: UserData.pont_x,
      pont_y: UserData.pont_y,
      pont_z: UserData.pont_z
    } as DB.UserType)
  }
  ctx.body = {
    code: OK_CODE,
    msg: `坐标(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`,
    data: null
  }
  return
})
//右
router.get('/mapD', async ctx => {
  const UID = ctx.state.user.uid
  const UserData1 = (await user.findOne({
    where: {
      uid: UID
    }
  })) as any
  //判断用户是否存在
  if (!UserData1) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '查询错误',
      data: null
    }
    return
  }
  const UserData = await GameApi.Users.read(UID)
  const { state, msg } = await goByBlood(UserData)
  if (state == 4001) {
    ctx.body = {
      code: ERROE_CODE,
      msg: msg,
      data: null
    }
  }
  UserData.pont_x += 10
  const mData = await GameApi.Map.getRecordsByXYZ(
    UserData.pont_x,
    UserData.pont_y,
    UserData.pont_z
  )
  if (mData) {
    await GameApi.Users.update(UID, {
      point_type: mData.type,
      pont_attribute: mData.attribute,
      pont_x: UserData.pont_x,
      pont_y: UserData.pont_y,
      pont_z: UserData.pont_z
    } as DB.UserType)
  }
  ctx.body = {
    code: OK_CODE,
    msg: `坐标(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`,
    data: null
  }
  return
})

export default router
