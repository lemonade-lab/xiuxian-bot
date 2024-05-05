import { ClientNTQQ, Controllers } from 'alemonjs'
import { isThereAUserPresent } from './api/index.js'
const TemplateId = '102055332_1713102677'
import { Messages } from './alemonjs.js'
const message = new Messages()
message.response(/^(#|\/)?模板消息/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  let p = ClientNTQQ.createTemplate(TemplateId)
  p.text('叶凡')
  p.button({ label: '击杀', value: '/个人信息' })
  Controllers(e).Message.card([p.getParam()])
  p = null
})
const test = message.ok
export { test }
