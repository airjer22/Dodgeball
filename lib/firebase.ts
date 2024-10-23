import { initializeApp, getApps } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCphhlXzp5Bjh5DPQX_8K8TjmqJrD5YW0",
  authDomain: "three-pin-dodgeball.firebaseapp.com",
  projectId: "three-pin-dodgeball",
  storageBucket: "three-pin-dodgeball.appspot.com",
  messagingSenderId: "318431712463",
  appId: "1:318431712463:web:49badd9c3f3731949953ba"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export const updateUserProfile = async (displayName) => {
  const user = auth.currentUser;
  if (user) {
    try {
      await updateProfile(user, { displayName });
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return false;
    }
  }
  return false;
};