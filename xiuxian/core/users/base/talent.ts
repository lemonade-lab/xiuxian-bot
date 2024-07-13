// 数据框架
import { talent, type TalentType } from 'xiuxian-db'

/**
 * 计算天赋大小
 * @param data
 * @returns
 */
export function talentSize(data: any[]) {
  let talentSize = 600
  for (const item of data) {
    if (item <= 5) talentSize -= 120
    if (item >= 6) talentSize -= 50
  }
  return talentSize
}

/**
 * 随机生成灵根
 * @returns
 */
export function getTalent() {
  const newtalent: number[] = []
  // 随机天赋数
  const talentCount = Math.floor(Math.random() * 5) + 1
  // 循环
  while (newtalent.length < talentCount) {
    // 得到 1 - 10
    const x = Math.floor(Math.random() * 10) + 1
    if (
      // 检查 x 是否存在
      newtalent.indexOf(x) !== -1 ||
      // 如果小于5 则 +5 看看是否存在
      (x <= 5 && newtalent.includes(x + 5)) ||
      // 如果大于5 则 -5 看看是否存在
      (x > 5 && newtalent.includes(x - 5))
    ) {
      continue
    }
    // 成功
    newtalent.push(x)
  }
  return newtalent
}

/**
 * 得到灵根名称
 * @param arr
 * @returns
 */
export async function getTalentName(arr: number[]) {
  let name = ''
  const TalentData: TalentType[] = (await talent.findAll({
    attributes: ['id', 'name'],
    raw: true
  })) as any
  for await (const item of arr) {
    // item是id
    for await (const obj of TalentData) {
      if (obj?.id == item) {
        name += obj?.name
      }
    }
  }
  return name == '' ? '无' : name
}
