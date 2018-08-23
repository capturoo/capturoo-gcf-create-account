'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({
  timestampsInSnapshots: true
});

exports.createAccount = functions.auth.user().onCreate(async userRecord => {
  try {
    let result = await firestore.collection('accounts').doc(userRecord.uid).set({
      email: userRecord.email,
      privateApiKey: (() => {
        let base62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let str = '';
        // 62^43 > 2^256 so 43 characters is greater than 256 bit entropy
        for (let b of crypto.randomBytes(43)) {
          str += base62[b % 62];
        }
        return str;
      })(),
      displayName: userRecord.displayName,
      created: admin.firestore.FieldValue.serverTimestamp(),
      lastModified: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});
