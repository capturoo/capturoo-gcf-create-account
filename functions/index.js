'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

console.log('global scope');

exports.createAccount = functions.auth.user().onCreate((event) => {
  console.log(event);
  console.log('local scope a');

  return firestore.collection('accounts').doc(event.uid).set({
    email: event.email,
    privateApiKey: (function () {
      let base62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let str = '';
      // 62^43 > 2^256 so 43 characters is greater than 256 bit entropy
      for (let b of crypto.randomBytes(43)) {
        str += base62[b % 62];
        };
      return str;
    })(),
    displayName: event.displayName,
    created: admin.firestore.FieldValue.serverTimestamp(),
    lastModified: admin.firestore.FieldValue.serverTimestamp()
  })
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.error(err);
  });
});
