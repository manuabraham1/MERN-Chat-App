import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAR7apvbFGvwxtATM15nQyI90ZyZVXALtU",
    authDomain: "talkative-a7f2f.firebaseapp.com",
    projectId: "talkative-a7f2f",
    storageBucket: "talkative-a7f2f.appspot.com",
    messagingSenderId: "367777030554",
    appId: "1:367777030554:web:6709354a64948bd5d25a23",
    measurementId: "G-7H6CHQHCBL"
  };

  const app = initializeApp(firebaseConfig);

  const storage = getStorage(app);

  export default storage;
