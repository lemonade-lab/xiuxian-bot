import koaRouter from 'koa-router'
import { ERROE_CODE, OK_CODE } from '../../config/ajax'
import {
  LevelsType,
  UserBagType,
  UserLevelType,
  levels,
  user_bag,
  user_level
} from '../../../src/db'
const router = new koaRouter({ prefix: '/api/v1/levels' })

async function searchLevels(UID) {
  // 固定数据读取
  const userLevelData: UserLevelType[] = (await user_level.findAll({
    where: {
      uid: UID,
      type: [1, 2, 3]
    },
    order: [['type', 'DESC']],
    raw: true
  })) as any
  // 境界数据
  const GaspracticeList: LevelsType[] = (await levels.findAll({
    attributes: ['name', 'type', 'exp_needed'],
    where: {
      grade: [userLevelData[2]?.realm],
      type: 1
    },
    raw: true
  })) as any
  // 境界数据
  const BodypracticeList: LevelsType[] = (await levels.findAll({
    attributes: ['name', 'type', 'exp_needed'],
    where: {
      grade: userLevelData[1]?.realm,
      type: 2
    },
    raw: true
  })) as any
  // 境界数据
  const SoulList: LevelsType[] = (await levels.findAll({
    attributes: ['name', 'type', 'exp_needed'],
    where: {
      grade: userLevelData[0]?.realm,
      type: 3
    },
    raw: true
  })) as any
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
