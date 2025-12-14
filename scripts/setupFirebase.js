import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6MXCBSjMcglGIJgd8K66NdjhlwMdLnOQ",
  authDomain: "fir-cube-hairart.firebaseapp.com",
  projectId: "fir-cube-hairart",
  storageBucket: "fir-cube-hairart.firebasestorage.app",
  messagingSenderId: "1006048309286",
  appId: "1:1006048309286:web:5dd1b525a4a2e1c90f76e7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const barbers = [
  {
    name: "John Smith",
    specialty: "Classic Cuts & Fades",
    experience: "8 years",
    rating: 4.9,
    workingHours: { start: "09:00", end: "17:00" },
    bio: "Specializes in classic cuts and modern fades"
  },
  {
    name: "Maria Garcia",
    specialty: "Creative Styles & Coloring",
    experience: "6 years",
    rating: 4.8,
    workingHours: { start: "10:00", end: "18:00" },
    bio: "Expert in creative hairstyles and coloring"
  }
];

async function setupFirebase() {
  try {
    console.log("Setting up Firebase...");
    
    // Add barbers
    for (const barber of barbers) {
      await addDoc(collection(db, "barbers"), barber);
      console.log(`Added: ${barber.name}`);
    }
    
    console.log("✅ Firebase setup complete!");
    console.log("📁 Collections created: barbers");
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

setupFirebase();