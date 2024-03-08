import { createContext } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";




const firebaseConfig = {
    apiKey: "AIzaSyBJqxxO7zqExpluNTtMiGWuoWoBCy8uC6Y",
    authDomain: "cljs92-n1.firebaseapp.com",
    projectId: "cljs92-n1",
    storageBucket: "cljs92-n1.appspot.com",
    messagingSenderId: "648432244731",
    appId: "1:648432244731:web:0ca492ed603d53cbb8dd5e"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const FirebaseContext = createContext();




const FirebaseProvider = ({ children }) => {
    const db = getFirestore(app);
    const messCollect = collection(db, "productItem"); // Specify the collection path here
    return (
        <FirebaseContext.Provider value={{ app, messCollect }}>
            {children}
        </FirebaseContext.Provider>
    );
};




export default FirebaseProvider;