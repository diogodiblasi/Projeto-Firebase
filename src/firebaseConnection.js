import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyD919RBBlThP0f6uJT5VoA21yF6etnEYDE",
    authDomain: "curso-47922.firebaseapp.com",
    projectId: "curso-47922",
    storageBucket: "curso-47922.appspot.com",
    messagingSenderId: "888014080303",
    appId: "1:888014080303:web:acb6498d6ae1b9e02479da",
    measurementId: "G-XQG6Y3SCEG"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db, auth}


