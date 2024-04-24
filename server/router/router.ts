import Router from 'koa-router'

const router = new Router({
  prefix: '/api'
})

/**
 * 请求相应测试
 * /
 * get
 */
router.get('/', ctx => {
  const query = ctx.query
  console.log('query', query)
  ctx.body = {
    code: 200,
    msg: '请求成功',
    data: null
  }
})

/**
 * 获得指定装备信息
 * /kill
 * get
 * id = 213
 */
router.get('/kill', ctx => {
  const query = ctx.query
  ctx.body = {
    code: 200,
    msg: '请求成功',
    data: null
  }
})

/**
 * 获得指定武器信息
 * /arms
 * get
 * id = 123
 */
router.get('/arms', ctx => {
  const query = ctx.query
  ctx.body = {
    code: 200,
    msg: '请求成功',
    data: null
  }
})

/**
 * 获得指定用户信息
 * /message
 * get
 * uid = 123456
 */
router.get('/message', ctx => {
  const query = ctx.query
  ctx.body = {
    code: 200,
    msg: '请求成功',
    data: null
  }
})

/**
 * 获得存档总计信息
 * /player
 * get
 */
router.get('/player', ctx => {
  ctx.body = {
    code: 200,
    msg: '请求成功',
    data: null
  }
})
export default router
