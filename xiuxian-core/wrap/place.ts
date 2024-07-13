import { Redis } from 'xiuxian-db'
import { ReadiName } from '../config'
export async function get(key: string | number) {
  return await Redis.get(`${ReadiName}:${key}:lace`)
}
export function set(key: string | number, val: any) {
  Redis.set(`${ReadiName}:${key}:lace`, val)
}
export function del(key: string | number) {
  Redis.del(`${ReadiName}:${key}:lace`)
}
