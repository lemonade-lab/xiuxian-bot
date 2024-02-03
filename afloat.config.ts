import { defineAfloat } from 'afloat'
export default defineAfloat({
  target: {
    directorys: ['sql', '.image', 'public']
  },
  nodemon: {
    watch: ['a.*.{ts,js}', 'src', 'main.{ts,js}']
  }
})
