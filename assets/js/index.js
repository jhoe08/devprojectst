import expressNodes from './admin/express.js'
import daLogin from './admin/login.js'
import daUtils from './admin/utils.js'
import globalDialog from './globalDialog.js'

const main = {
  init(func) {
    expressNodes.init(func)
    daLogin.init()
    globalDialog.init()
    // daUtils.init()
    // const { notifyCustom, fieldsUpdated } = daUtils
  }
}

main.init(io())