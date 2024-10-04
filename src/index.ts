import { defineChildren } from 'alemonjs'
import '@/test.js'
export default defineChildren(() => {
  return {
    onCreated() {
      console.log('Local onCreated')
    }
  }
})
