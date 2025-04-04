// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_APIKEY,
  authDomain: import.meta.env.VITE_REACT_APP_AUTHDOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_PROJECTID,
  storageBucket: import.meta.env.VITE_REACT_APP_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_APP_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_REACT_APP_APPID,
};

const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth, serverUrl };
