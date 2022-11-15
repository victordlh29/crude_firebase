import firebase from "firebase/app";
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCjVDV8I68nQR8QTeeJN9B1Ci6qI4pufYo",
  authDomain: "crude-f6dd0.firebaseapp.com",
  projectId: "crude-f6dd0",
  storageBucket: "crude-f6dd0.appspot.com",
  messagingSenderId: "737598438576",
  appId: "1:737598438576:web:6ca5805ac0929404a2cf75"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export {firebase}