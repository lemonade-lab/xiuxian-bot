import redisClient, { Redis as RedisClient } from 'ioredis'
import { config } from 'dotenv'
config({ path: './alemon.env' })
function createRedis() {
  const ALRedis = new redisClient({
    host: process.env?.ALEMONJS_REDIS_HOST ?? 'localhost',
    port: Number(process.env?.ALEMONJS_REDIS_PORT ?? 6379),
    password: process.env?.ALEMONJS_REDIS_PASSWORD ?? '',
    db: Number(process.env?.ALEMONJS_REDIS_DB ?? 3),
    maxRetriesPerRequest: null
  })
  ALRedis.on('error', (err: any) => {
    console.error('\n[REDIS]', err)
    console.error('\n[REDIS]', '请检查配置')
    process.cwd()
  })
  return ALRedis
}

//
export const Redis: RedisClient = createRedis()
