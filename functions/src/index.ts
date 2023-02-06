import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = admin.initializeApp()

exports.onCreateUser = functions.auth.user().onCreate(user => {
  if (user.email) {
    admin.firestore(app).collection('users').doc(user.uid).set({
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
      createdAt: user.metadata.creationTime,
      // lastSignInTime: user.metadata.lastSignInTime,
    })
  }
})

exports.onUpdateUser = functions.auth.user().onCreate(user => {
  if (user.email) {
    admin.firestore(app).collection('users').doc(user.uid).update({
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.metadata.creationTime,
      // lastSignInTime: user.metadata.lastSignInTime,
    })
  }
})

exports.onDeleteUser = functions.auth.user().onDelete(user => {
  admin.firestore(app).collection('users').doc(user.uid).delete()
})
