const nodemailer = require('nodemailer');
const connection = require('./database');
const moment = require('moment');

// Email transporter setup (reuse from app.js)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASS
  }
});

/**
 * Send an email notification
 * @param {Object} options - { to, subject, html, attachments }
 * @returns {Promise}
 */
async function sendEmailNotification({ to, subject, html, attachments = [] }) {
  const mailOptions = {
    from: `DA RFO7 <${process.env.APP_EMAIL}>`,
    to,
    subject,
    html,
    attachments,
  };
  return transporter.sendMail(mailOptions);
}

/**
 * Send an in-app notification (DB)
 * @param {Object} options - { message, link, component, concerning }
 * @returns {Promise}
 */
async function sendInAppNotification({ message, link, component, concerning }) {
  const notificationPayload = {
    message,
    link,
    component,
    concerning,
    created_at: moment().format('YYYY-MM-DD HH:mm:ss')
  };
  return connection.postNotifications(JSON.stringify(notificationPayload));
}

/**
 * Notify next approver and requestor for approval workflow
 * @param {Object} params - { nextApprover, requestor, transactionId, stepTitle }
 * @returns {Promise}
 */
async function notifyApprovalStep({ nextApprover, requestor, transactionId, stepTitle }) {
  // Notify next approver (email + in-app)
  if (nextApprover?.email) {
    await sendEmailNotification({
      to: nextApprover.email,
      subject: `Approval Needed: Transaction ${transactionId}`,
      html: `<p>You have a new transaction to approve: <b>${transactionId}</b> at step <b>${stepTitle}</b>.</p>`
    });
  }
  await sendInAppNotification({
    message: `You have a new transaction to approve at step: ${stepTitle}`,
    link: transactionId,
    component: 'transactions',
    concerning: nextApprover?.employeeid || null
  });

  // Notify requestor (email + in-app)
  if (requestor?.email) {
    await sendEmailNotification({
      to: requestor.email,
      subject: `Your Transaction Progressed: ${transactionId}`,
      html: `<p>Your transaction <b>${transactionId}</b> has progressed to <b>${stepTitle}</b>.</p>`
    });
  }
  await sendInAppNotification({
    message: `Your transaction has progressed to step: ${stepTitle}`,
    link: transactionId,
    component: 'transactions',
    concerning: requestor?.employeeid || null
  });
}

module.exports = {
  sendEmailNotification,
  sendInAppNotification,
  notifyApprovalStep
};
