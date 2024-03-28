import { defineAfloat } from 'afloat'
export default defineAfloat({
  target: {
    directorys: ['sql', 'public']
  },
  nodemon: {
    watch: ['a.*.{ts,js,tsx,jsx}', 'src', 'main.{ts,js,tsx,jsx}']
  }
})
