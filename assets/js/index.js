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

    // console.log('Client: ...')
    // daUtils.init()
    // const { notifyCustom, fieldsUpdated } = daUtils

    document.querySelectorAll('[readonly]').forEach(input => {
      const group = input.closest('.form-group');
      if (group) {
        group.classList.add('readonly');
      }
    });


    const syncButton = document.getElementById('sysncFunds');
    syncButton?.addEventListener('click', function () {
      // console.log('Sync button clicked');
      // const allocatedFundsInstance = new AllocatedFunds();
      allocatedFunds.syncFunds()
      setTimeout(() => {
        document.location.reload();
      }, 3000); // Reload the page after 3 seconds
      // allocatedFundsInstance.sysncFunds()
    })

    setInterval(() => {
      const numberInputs = document.querySelectorAll('input[data-type="number"]');

      numberInputs.forEach(input => {
        formatNumberWithCommas({ target: input }); // Initial formatting on page load
      });
    }, 800);

  }
}

// main.init(io())

document.addEventListener('DOMContentLoaded', () => {
  main.init(io());
});