import koaRouter from 'koa-router'
import { user } from 'xiuxian-db'

import * as GameApi from 'xiuxian-core'

import { ERROE_CODE, OK_CODE } from '../../config/ajax'

import { State } from 'xiuxian-core'

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
  const UserData = await user
    .findOne({ where: { uid: UID } })
    .then(res => res.dataValues)
  //
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
  const UserData = await user
    .findOne({ where: { uid: UID } })
    .then(res => res.dataValues)
  const { state, msg } = await State.goByBlood(UserData)
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
    await user.update(
      {
        point_type: mData.type,
        pont_attribute: mData.attribute,
        pont_x: UserData.pont_x,
        pont_y: UserData.pont_y,
        pont_z: UserData.pont_z
      },
      { where: { uid: UID } }
    )
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
  const UserData = await user
    .findOne({ where: { uid: UID } })
    .then(res => res.dataValues)
  const { state, msg } = await State.goByBlood(UserData)
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
    await user.update(
      {
        point_type: mData.type,
        pont_attribute: mData.attribute,
        pont_x: UserData.pont_x,
        pont_y: UserData.pont_y,
        pont_z: UserData.pont_z
      },
      { where: { uid: UID } }
    )
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
  const UserData = await user
    .findOne({ where: { uid: UID } })
    .then(res => res.dataValues)
  const { state, msg } = await State.goByBlood(UserData)
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
    await user.update(
      {
        point_type: mData.type,
        pont_attribute: mData.attribute,
        pont_x: UserData.pont_x,
        pont_y: UserData.pont_y,
        pont_z: UserData.pont_z
      },
      { where: { uid: UID } }
    )
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
  const UserData = await user
    .findOne({ where: { uid: UID } })
    .then(res => res.dataValues)
  const { state, msg } = await State.goByBlood(UserData)
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
    await user.update(
      {
        point_type: mData.type,
        pont_attribute: mData.attribute,
        pont_x: UserData.pont_x,
        pont_y: UserData.pont_y,
        pont_z: UserData.pont_z
      },
      { where: { uid: UID } }
    )
  }
  ctx.body = {
    code: OK_CODE,
    msg: `坐标(${UserData.pont_x},${UserData.pont_y},${UserData.pont_z})`,
    data: null
  }
  return
})

export default router
