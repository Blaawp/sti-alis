// eslint-disable-next-line object-curly-spacing
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const express = require('express');
const app = express();
const {
  TransactionController,
  manageNotification,
  cleanUpBookReservations,
} = require('./src/controllers/TransactionController');
const { onSchedule } = require('firebase-functions/v2/scheduler');

app.get('/', TransactionController.getTransactions);
app.get('/sendSms', TransactionController.sendSms);
app.get(
  '/checkReservedBookIfExpire',
  TransactionController.checkReservedBookIfExpire,
);

exports.rpaths = onRequest(app);
// Timezone was set to Asia/Manila
exports.cronSendEmail = onSchedule(
  { schedule: '00 06 * * *', timeZone: 'Asia/Manila' },
  async (event) => {
    logger.log('cronSendEmail has been fired');
    await manageNotification();
    logger.log('cronSendEmail is done');
  },
);

exports.cronCheckReservedBooksIfExpire = onSchedule(
  { schedule: '00 18 * * *', timeZone: 'Asia/Manila' },
  async (event) => {
    logger.log('cronCheckReservedBooksIfExpire has been fired');
    await cleanUpBookReservations();
    logger.log('cronCheckReservedBooksIfExpire is done');
  },
);
