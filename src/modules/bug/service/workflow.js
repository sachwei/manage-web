let Stately = require('stately.js')

let bug = Stately.machine({
  'NEW': {
    save: () => {
      console.log('save')
    },
    process: () => {
      console.log('process')
      return 'FIX'
    }
  },
  'FIX': {
    fix: () => {
      console.log('fix')
      return 'TEST'
    }
  },
  'TEST': {
    close: () => {
      console.log('close')
    }
  }
})

export default bug
