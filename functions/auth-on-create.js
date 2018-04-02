'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require('./credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://leads-dashboard-staging.firebaseio.com'
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
  const user = event.data;

  return createAccount(user.uid, user.email)
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.error(err);
    });
});
