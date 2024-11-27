import daExpress from './admin/express.js'
import daLogin from './admin/login.js'
import daUtils from './admin/utils.js'

const main = {
  init(func) {
    daExpress.init(func)
    daLogin.init()
    // daUtils.init()
    // const { notifyCustom, fieldsUpdated } = daUtils
  }
}

main.init(io())