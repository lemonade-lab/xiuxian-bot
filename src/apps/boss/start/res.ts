import { Text, useParse, useSend } from 'alemonjs'
import { console } from 'inspector'
import { isUser } from 'xiuxian-api'
import { Boss } from 'xiuxian-core'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const Send = useSend(e)
    // 检查活动时间
    // if (!Boss.isBossActivityOpen()) {
    //   Send(Text('BOSS已经逃跑....'))
    //   return
    // }
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const text = useParse(e.Megs, 'Text')
    let key: '1' | '2' = '1'
    if (/银角/.test(text)) {
      key = '2'
    }
    // 查看boss信息
    const bossInfo = await Boss.getBossData(key)
    // 如果没有boss信息,则创建
    if (!bossInfo) {
      Send(Text('BOSS正在降临...'))
      Boss.updateBossData(key)
      return
    }

    if (bossInfo.data.battle_blood_now <= 1) {
      Send(Text('BOSS复活中....'))
      Boss.updateBossData(key)
      return
    }

    //
    try {
      const Now = new Date()
      // 如果创建时间超过2h,则重新创建
      if (Now.getTime() - bossInfo.createAt > 12 * 60 * 60 * 1000) {
        Send(Text('BOSS已经逃跑....'))
        Boss.updateBossData(key)
        return
      }
      Send(
        Text(
          [
            `[${key == '1' ? '金角' : '银角'}]`,
            `境界:${bossInfo.level}`,
            `攻击:${bossInfo.data.battle_attack}`,
            `防御:${bossInfo.data.battle_defense}`,
            `血量:${bossInfo.data.battle_blood_now}/${bossInfo.data.battle_blood_limit}`,
            `暴击:${bossInfo.data.battle_critical_hit}`,
            `暴伤:${bossInfo.data.battle_critical_damage}`,
            `速度:${bossInfo.data.battle_speed}`
          ].join('\n')
        )
      )
      //
    } catch (e) {
      console.error(e)
      Send(Text('BOSS信息异常'))
    }
  },
  'message.create',
  /^(#|\/)?(金角|银角)信息/
)
