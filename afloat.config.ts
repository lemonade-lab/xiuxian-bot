import { defineAfloat } from 'afloat'
export default defineAfloat({
  nodemon: {
    watch: ['a.*.{ts,js,tsx,jsx}', 'src', 'main.{ts,js,tsx,jsx}']
  }
})
