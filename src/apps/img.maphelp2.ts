import { Cooling } from 'xiuxian-core'
import { picture } from 'xiuxian-img'
import { Messages } from 'alemonjs'
export default new Messages().response(/^(#|\/)?修仙配置$/, async e => {
  const img = await picture.render('Defsetcomponent', {
    name: 'boxDefset',
    props: {
      data: Cooling
    }
  })
  if (typeof img != 'boolean') e.reply(img)
  return
})
