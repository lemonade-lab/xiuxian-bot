import { Messages } from 'alemonjs'
// import { createRequire } from 'module';
// import ollama from 'ollama'
// const require = createRequire(import.meta.url)
// await ollama.chat({
//     model: 'llama3.1', messages: require('../context.json'), stream: true
// });
export default new Messages().response(/^(#|\/)?小白/, async _ => {
  // const response = await ollama.chat({
  //     model: 'llama3.1', messages: [{
  //         "role": "user",
  //         "content": e.msg.replace(/^(#|\/)?小白/, '')
  //     }], stream: true
  // })
  // let msg = []
  // for await (const part of response) {
  //     console.log("part.message.content", part.message.content)
  //     if (/。/.test(part.message.content)) {
  //         console.log("发送")
  //         msg.push(part.message.content)
  //         await e.reply(msg.join(''))
  //         msg = []
  //     } else {
  //         msg.push(part.message.content)
  //     }
  // }
  // await e.reply(msg)
  return
})
