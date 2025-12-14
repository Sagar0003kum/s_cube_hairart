import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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
const auth = getAuth(app);

// Barbers data
const barbers = [
  {
    name: "John Smith",
    specialty: "Classic Cuts & Fades",
    experience: "8 years",
    rating: 4.9,
    workingHours: { start: "09:00", end: "17:00" },
    bio: "Specializes in classic cuts and modern fades",
    available: true
  },
  {
    name: "Maria Garcia",
    specialty: "Creative Styles & Coloring",
    experience: "6 years",
    rating: 4.8,
    workingHours: { start: "10:00", end: "18:00" },
    bio: "Expert in creative hairstyles and coloring",
    available: true
  },
  {
    name: "David Johnson",
    specialty: "Beard Trimming & Grooming",
    experience: "5 years",
    rating: 4.7,
    workingHours: { start: "11:00", end: "19:00" },
    bio: "Beard grooming specialist with precision techniques",
    available: true
  }
];

// Create test user
const testUser = {
  email: "test@squarehairart.com",
  password: "Test123!"
};

async function initializeFirestore() {
  console.log("🔧 Initializing Firestore with secure data...");
  
  try {
    // 1. Create test user
    console.log("Creating test user...");
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      testUser.email, 
      testUser.password
    );
    const userId = userCredential.user.uid;
    console.log("✅ Test user created:", userId);
    
    // 2. Add barbers
    console.log("Adding barbers...");
    for (const barber of barbers) {
      const docRef = await addDoc(collection(db, "barbers"), barber);
      console.log(`✅ Barber added: ${barber.name} (ID: ${docRef.id})`);
    }
    
    // 3. Create admin record for this user
    console.log("Setting up admin permissions...");
    await setDoc(doc(db, "admins", userId), {
      email: testUser.email,
      role: "admin",
      createdAt: new Date().toISOString()
    });
    
    // 4. Create user profile
    console.log("Creating user profile...");
    await setDoc(doc(db, "users", userId), {
      firstName: "Test",
      lastName: "User",
      email: testUser.email,
      phone: "+1234567890",
      createdAt: new Date().toISOString(),
      isAdmin: true
    });
    
    console.log("\n🎉 Firestore initialized successfully!");
    console.log("\n📋 Credentials:");
    console.log("Email:", testUser.email);
    console.log("Password:", testUser.password);
    console.log("\n🔗 Login at: http://localhost:3000/login");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log("📝 Test user already exists. Try logging in with:");
      console.log("Email: test@squarehairart.com");
      console.log("Password: Test123!");
    }
  }
}

initializeFirestore();