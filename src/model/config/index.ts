//
export const ASS_TYPING_MAP = {
  宗: 0,
  派: 1,
  门: 2,
  阁: 3,
  宫: 4,
  教: 5,
  国: 6,
  谷: 7,
  洞: 8,
  组: 9,
  堡: 10,
  城: 11,
  会: 12
}

/**
 * 身份
 */
export const ASS_IDENTITY_MAP = {
  0: 'master',
  1: 'vice_master',
  2: 'super_admin',
  3: 'admin',
  4: 'core_member',
  5: 'senior_menber',
  6: 'intermediate_member',
  7: 'lowerlevel_member',
  8: 'tagged_member',
  9: 'reviewed_member'
}

// 自定义冷却反馈
export const CD_MAP = {
  0: '攻击',
  1: '锻体',
  2: '闭关',
  3: '改名',
  4: '道宣',
  5: '赠送',
  6: '突破',
  7: '破体',
  8: '转世',
  9: '行为',
  10: '击杀',
  11: '决斗',
  12: '修行',
  13: '渡劫',
  14: '双修',
  15: '偷药',
  16: '占领矿场',
  17: '偷动物',
  18: '做饭',
  19: '顿悟',
  20: '比斗',
  21: '偷袭',
  22: '采集',
  23: '挑战'
}
// redis前缀  xiuxian   app  维护 redis 不好找了
export const ReadiName = 'xiuxian-plugin'
export const RedisMonster = 'xiuxian:monsters5'
export const RedisExplore = 'xiuxian:explore6'
export const RedisBull = 'xiuxian:bull'
export const RedisBullAction = 'xiuxian:bull:Action'
