import { Cooling } from 'xiuxian-core'
import { Messages } from 'alemonjs'
import { pictureRender } from 'xiuxian-img'
export default new Messages().response(/^(#|\/)?修仙配置$/, async e => {
  const img = await pictureRender('Defsetcomponent', {
    name: 'boxDefset',
    props: {
      data: Cooling
    }
  })
  if (typeof img != 'boolean') e.reply(img)
  return
})
