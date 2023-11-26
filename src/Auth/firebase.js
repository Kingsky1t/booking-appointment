import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDb3IZGgYQ_1DENP44FeeodXO0GnLyMWhg",
    authDomain: "booking-appointment-3cd34.firebaseapp.com",
    projectId: "booking-appointment-3cd34",
    storageBucket: "booking-appointment-3cd34.appspot.com",
    messagingSenderId: "330067773969",
    appId: "1:330067773969:web:5c26e3bbcb638cdac4ffb0",
    measurementId: "G-K09Z0N6JVT",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
