
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGo_ZOgTSn2uy62qel_m595fXmXiNawfA",
  authDomain: "bby06-attendr.firebaseapp.com",
  projectId: "bby06-attendr",
  storageBucket: "bby06-attendr.appspot.com",
  messagingSenderId: "884971187466",
  appId: "1:884971187466:web:43326a132d39becfbb1ef3"
};


//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();