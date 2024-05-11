import { ClientNTQQ, Controllers, Messages } from 'alemonjs'
const TemplateId = '102055332_1713102677'
const message = new Messages()
message.response(/^(#|\/)?模板消息/, async e => {
  let p = ClientNTQQ.createTemplate(TemplateId)
  p.text('叶凡')
  p.button({ label: '击杀', value: '/个人信息' })
  Controllers(e).Message.card([p.getParam()])
  p = null
})
const msg = message.ok
export { msg }
