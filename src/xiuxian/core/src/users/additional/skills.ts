import { user_skills, goods, user } from 'xiuxian-db'
import { talentSize } from '../base/talent.js'

/**
 * 更新天赋
 * @param UID
 * @returns
 */
export async function updataEfficiency(UID: string, talent: number[]) {
  // 统计
  let skill = 0
  const skills = await user_skills
    .findAll({
      where: {
        uid: UID
      },
      include: {
        model: goods
      }
    })
    .then(res => res.map(item => item?.dataValues))
  for await (const item of skills) {
    skill += item['good']['dataValues']['size']
  }
  // 统计灵根
  const size = talentSize(talent)
  // 更新用户
  await user.update(
    {
      talent: talent,
      talent_size: size + skill
    },
    {
      where: {
        uid: UID
      }
    }
  )
  return true
}
