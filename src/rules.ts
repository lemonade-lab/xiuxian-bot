import { Events } from './alemonjs.js'
import skytower from './message/sky.js'
// 创建事件
const event = new Events()
const x = skytower.ok()
console.log('x', new x())
event.use(skytower.ok())
export { event }
