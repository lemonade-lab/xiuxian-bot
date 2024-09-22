import { user } from 'xiuxian-db'
const ACTIONMAP = {
  0: '空闲',
  1: '闭关',
  2: '锻体',
  3: '赶路',
  4: '传送',
  5: '渡劫',
  6: '扩建',
  7: '秘境',
  8: '打坐'
}

/**
 * 更改行为状态
 * @param UID
 * @param param1
 */
export async function set(
  UID: string,
  { actionID = 0, startTime = 0, endTime = 0 }
) {
  await user.update(
    {
      state: actionID,
      state_start_time: startTime,
      state_end_time: endTime
    },
    {
      where: {
        uid: UID
      }
    }
  )
}

/**
 * 设置为空闲状态
 * @param UID
 */
export async function del(UID: string) {
  await user.update(
    {
      state: 0,
      state_start_time: 9999999999999,
      state_end_time: 9999999999999
    },
    {
      where: {
        uid: UID
      }
    }
  )
}

/**
 * 行为检测
 * @param UID
 * @returns
 */
export async function Go(UserData) {
  // 空闲状态
  if (UserData.state == 0) {
    return {
      state: 2000,
      msg: '成功'
    }
  }
  // 不是空闲状态
  if (
    new Date().getTime() >=
    UserData.state_end_time + UserData.state_start_time
  ) {
    del(UserData.uid)
    return {
      state: 2000,
      msg: '通过'
    }
  }
  return {
    state: 4001,
    msg: `${ACTIONMAP[UserData.state]}中...`
  }
}

/**
 * 行为检测
 * @param UID
 * @returns
 */
export async function goByBlood(UserData) {
  // 空闲状态
  if (UserData.state == 0) {
    if (UserData.battle_blood_now >= 1) {
      return {
        state: 2000,
        msg: '成功'
      }
    }
    return {
      state: 4001,
      msg: '血量不足'
    }
  }
  // 不是空闲状态
  if (
    new Date().getTime() >=
    UserData.state_end_time + UserData.state_start_time
  ) {
    del(UserData.uid)
    return {
      state: 2000,
      msg: '通过'
    }
  }
  return {
    state: 4001,
    msg: `${ACTIONMAP[UserData.state]}中...`
  }
}
