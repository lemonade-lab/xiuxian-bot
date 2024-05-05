import { Events } from './alemonjs.js'
import skytower from './message/sky.js'
// 创建事件
const event = new Events()
event.use(skytower.ok())
export { event }
