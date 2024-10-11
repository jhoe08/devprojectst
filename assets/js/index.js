import daExpress from './admin/express.js'
import daLogin from './admin/login.js'

const main = {
  init(func) {
    daExpress.init(func)
    daLogin.init()
  }
}

main.init(io())