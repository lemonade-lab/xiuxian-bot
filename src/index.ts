import { defineChildren } from 'alemonjs'
export default defineChildren(() => {
  return {
    onCreated() {
      // 整个模块被识别时
      console.log('修仙机器人启动')
    }
  }
})
