import koaRouter from 'koa-router'
import { OK_CODE } from '../../config/ajax'
import { levels, user_level } from 'xiuxian-db'
const router = new koaRouter({ prefix: '/api/v1/levels' })

async function searchLevels(UID) {
  // 固定数据读取
  const userLevelData = await user_level
    .findAll({
      where: {
        uid: UID,
        type: [1, 2, 3]
      },
      order: [['type', 'DESC']]
    })
    .then(res => res.map(item => item.dataValues))
  // 境界数据
  const GaspracticeList = await levels
    .findAll({
      attributes: ['name', 'type', 'exp_needed'],
      where: {
        grade: [userLevelData[2]?.realm],
        type: 1
      }
    })
    .then(res => res.map(item => item.dataValues))
  // 境界数据
  const BodypracticeList = await levels
    .findAll({
      attributes: ['name', 'type', 'exp_needed'],
      where: {
        grade: userLevelData[1]?.realm,
        type: 2
      }
    })
    .then(res => res.map(item => item.dataValues))
  // 境界数据
  const SoulList = await levels
    .findAll({
      attributes: ['name', 'type', 'exp_needed'],
      where: {
        grade: userLevelData[0]?.realm,
        type: 3
      }
    })
    .then(res => res.map(item => item.dataValues))
  // 固定数据读取
  const GaspracticeData = GaspracticeList[0]
  const BodypracticeData = BodypracticeList[0]
  const SoulData = SoulList[0]
  return {
    gaspractice: {
      Name: GaspracticeData.name,
      Experience: userLevelData[2]?.experience,
      ExperienceLimit: GaspracticeData.exp_needed
    },
    bodypractice: {
      Name: BodypracticeData.name,
      Experience: userLevelData[1]?.experience,
      ExperienceLimit: BodypracticeData.exp_needed
    },
    soul: {
      Name: SoulData.name,
      Experience: userLevelData[0]?.experience,
      ExperienceLimit: SoulData.exp_needed
    }
  }
}

// 境界数据
router.get('/search', async ctx => {
  const UID = ctx.state.user.uid
  ctx.body = {
    code: OK_CODE,
    msg: '请求完成',
    data: await searchLevels(UID)
  }
  return
})

export default router
