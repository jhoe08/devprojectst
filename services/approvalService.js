const moment = require("moment");

async function approveTransaction({ product_id, steps_number, updated_by, remarks, username, connection, io }) {
  const data = {
    set: {
      status: 'approved',
      updated_by,
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      remarks
    },
    where: { product_id, steps_number }
  };

  await connection.updateTransactionActivity(JSON.stringify(data));
  io.emit('retrieveActitivities', product_id);

  await connection.postTransactionActivity(JSON.stringify({
    status: 'pending',
    product_id,
    created_at: moment().add(1, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    steps_number: parseInt(steps_number, 10) + 1,
    updated_by,
  }));

  await connection.postNotifications(JSON.stringify({
    message: remarks,
    link: product_id,
    component: 'transactions',
  }));

  return { success: true, message: "Approval step advanced." };
}

module.exports = { approveTransaction };
