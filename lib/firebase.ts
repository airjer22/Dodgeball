import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCphhlXzp5Bjh5DPQX_8K8TjmqJrD5YW0",
  authDomain: "three-pin-dodgeball.firebaseapp.com",
  projectId: "three-pin-dodgeball",
  storageBucket: "three-pin-dodgeball.appspot.com",
  messagingSenderId: "318431712463",
  appId: "1:318431712463:web:49badd9c3f3731949953ba"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);