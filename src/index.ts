import { defineChildren } from 'alemonjs'
import './postcss.js'
export default defineChildren(() => {
  return {
    onCreated() {
      console.log('Local onCreated')
    }
  }
})
