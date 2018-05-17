'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
const serviceAccount = require('./credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://capturoo-api-staging.firebaseio.com'
});

const firestore = admin.firestore();

/**
 * Create a new account
 *
 * @param {String} uid current user id
 * @param {String} name account name
 * @returns {Account} account instance
 */
function createAccount(uid, email) {
  return new Promise(function(resolve, reject) {
    firestore.collection('accounts').doc(uid).set({
      email,
      privateApiKey: (function () {
        let base62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let str = '';
        // 62^43 > 2^256 so 43 characters is greater than 256 bit entropy
        for (let b of crypto.randomBytes(43)) {
          str += base62[b % 62];
        };
        return str;
      })(),
      created: admin.firestore.FieldValue.serverTimestamp(),
      lastModified: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(result => {
      resolve(result);
    })
    .catch(err => {
      reject(err);
    });
  });
}

exports.createAccountGcf = functions.auth.user().onCreate((event) => {
  return createAccount(event.uid, event.email)
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.error(err);
    });
});
