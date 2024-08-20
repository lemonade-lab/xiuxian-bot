import { hash } from 'alemonjs'

export const nameMap = {
  boolere_covery: '回血',
  exp_gaspractice: '修为',
  exp_bodypractice: '气血',
  exp_soul: '魂念'
}

/**
 * 重新生产UID
 * @param UID
 * @returns
 */
export const createUID = (UID: string) => {
  return isNaN(Number(UID)) || UID.length > 11 ? hash(UID) : UID
}
