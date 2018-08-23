# CHANGELOG
## 2.0.0 (23 August 2018)
+ Use Node 8 Runtime
+ Remove functions.config().firebase and use default config instead
+ timestampsInSnapshots: true
+ Use async/await try/catch in place of Promise chains
+ Upgrade to firebase-admin 6 and firebase-functions 2

## 1.2.0 (2 June 2018)
+ Move code to a single function inside of index.js to avoid require() statement
+ Remove credentials and use Firebase admin config

## 1.1.0 (17 May 2018)
+ Remove external apikeygen dependency
+ Use custom inline base62 random string generator build on Node.js crypto

## 1.0.0
+ Background trigger function for Auth onCreate that creates a new account including private API Key (base62 format)
