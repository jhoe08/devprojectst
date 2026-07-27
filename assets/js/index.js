import expressNodes from './admin/express.js'
import daLogin from './admin/login.js'
import daUtils from './admin/utils.js'
import globalDialog from './globalDialog.js'
import allocatedFunds from './pages/allocatedFunds.js'


const main = {
  init(func) {
    expressNodes.init(func)
    daLogin.init()
    globalDialog.init()

    console.log('Client: ...')
    // daUtils.init()
    // const { notifyCustom, fieldsUpdated } = daUtils

    

    const syncButton = document.getElementById('sysncFunds');
    syncButton?.addEventListener('click', function () {
        console.log('Sync button clicked');
        // const allocatedFundsInstance = new AllocatedFunds();
        allocatedFunds.syncFunds()
        // allocatedFundsInstance.sysncFunds()
    })


    document.querySelectorAll('[readonly]').forEach(input => {
      input.closest('.form-group').classList.add('readonly')
    })
  }
}

main.init(io())