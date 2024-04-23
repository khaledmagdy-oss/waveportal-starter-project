// firebase.js
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAXLvKLpXXNaFbIsa0S7bNpVf71y9LMYe8",
  authDomain: "blockchain-file-transfer.firebaseapp.com",
  projectId: "blockchain-file-transfer",
  storageBucket: "blockchain-file-transfer.appspot.com",
  messagingSenderId: "1022597411513",
  appId: "1:1022597411513:web:a7d12f5cd15c026cb56168",
  measurementId: "G-LM7ZPK5DGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
