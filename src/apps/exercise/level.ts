import { plugin, type AEvent } from 'alemonjs'
import {
  isThereAUserPresent,
  GameApi,
  victoryCooling
} from '../../api/index.js'
export class Level extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?突破$/, fnc: 'breakThrough' },
        { reg: /^(#|\/)?破境$/, fnc: 'breakingTheBoundary' },
        { reg: /^(#|\/)?(顿悟|頓悟)$/, fnc: 'insight' }
      ]
    })
  }

  /**
   * 突破
   * @param e
   * @returns
   */
  async breakThrough(e: AEvent) {
    levelUp(e, 6, 1, 90)
    return
  }

  /**
   * 破境
   * @param e
   * @returns
   */
  async breakingTheBoundary(e: AEvent) {
    levelUp(e, 7, 2, 80)
    return
  }

  /**
   * 頓悟
   * @param e
   * @returns
   */
  async insight(e: AEvent) {
    levelUp(e, 19, 3, 80)
    return
  }
}

/**
 *
 * @param e
 * @param CDID
 * @param ID
 * @param p
 * @returns
 */
async function levelUp(
  e: AEvent,
  CDID: GameApi.Burial.CDType,
  ID: 1 | 2 | 3,
  p: number
) {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return

  if (!(await victoryCooling(e, UID, CDID))) return

  const LevelMsg = await GameApi.Levels.read(UID, ID)
  if (LevelMsg.experience <= 100) {
    e.reply(['毫无自知之明'], {
      quote: e.msg_id
    })

    return
  }
  // 取值范围 [1 100 ] 突破概率为 (68-realm)/100
  const number = LevelMsg.realm ?? 0
  if (!GameApi.Method.isTrueInRange(1, 100, p - LevelMsg.realm + number)) {
    // 设置突破冷却

    GameApi.Burial.set(UID, CDID, GameApi.Cooling.CD_Level_up)

    /** 随机顺序损失经验  */
    const randomKey = GameApi.Levels.getRandomKey()
    const size = Math.floor(LevelMsg.experience / (randomKey + 1))
    await GameApi.Levels.reduceExperience(UID, ID, size)
    const msg = await GameApi.Levels.getCopywriting(
      ID,
      randomKey,
      size > 999999 ? 999999 : size
    )
    e.reply([msg], {
      quote: e.msg_id
    })

    return
  }
  const { msg } = await GameApi.Levels.enhanceRealm(UID, ID)
  e.reply([msg], {
    quote: e.msg_id
  })

  // 设置
  GameApi.Burial.set(UID, CDID, GameApi.Cooling.CD_Level_up)
  setTimeout(async () => {
    const UserData = await GameApi.Users.read(UID)
    // 更新面板
    await GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now)
  }, 1500)
  return
}
