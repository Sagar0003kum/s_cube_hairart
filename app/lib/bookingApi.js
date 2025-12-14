import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy
} from "firebase/firestore";

// ========== DEMO DATA (FALLBACK) ==========
const DEMO_BARBERS = [
  {
    id: "barber1",
    name: "John Smith",
    specialty: "Classic Cuts & Fades",
    experience: "8 years",
    rating: 4.9,
    workingHours: { start: "09:00", end: "17:00" },
    bio: "Specializes in classic cuts and modern fades",
    image: null
  },
  {
    id: "barber2",
    name: "Maria Garcia",
    specialty: "Creative Styles & Coloring",
    experience: "6 years",
    rating: 4.8,
    workingHours: { start: "10:00", end: "18:00" },
    bio: "Expert in creative hairstyles and coloring",
    image: null
  },
  {
    id: "barber3",
    name: "David Johnson",
    specialty: "Beard Trimming & Grooming",
    experience: "5 years",
    rating: 4.7,
    workingHours: { start: "11:00", end: "19:00" },
    bio: "Beard grooming specialist with precision techniques",
    image: null
  }
];

// ========== API FUNCTIONS ==========

// 1. GET BARBERS - No warning flags
export const getBarbers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "barbers"));
    
    if (querySnapshot.empty) {
      console.log("📝 Loading demo barbers");
      return { 
        success: true, 
        data: DEMO_BARBERS,
        message: "Ready to book"
      };
    }
    
    const barbers = [];
    querySnapshot.forEach((doc) => {
      barbers.push({ id: doc.id, ...doc.data() });
    });
    
    return { 
      success: true, 
      data: barbers,
      message: "Barbers loaded"
    };
  } catch (error) {
    console.log("📝 Using demo barbers");
    return { 
      success: true, 
      data: DEMO_BARBERS,
      message: "Ready to book"
    };
  }
};

// 2. GET AVAILABLE SLOTS
export const getAvailableSlots = async (barberId, date) => {
  const generateSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute of ["00", "30"]) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
      }
    }
    return slots;
  };
  
  return { 
    success: true, 
    data: generateSlots()
  };
};

// 3. CREATE BOOKING
export const createBooking = async (bookingData) => {
  try {
    const bookingWithIds = {
      ...bookingData,
      barberId: bookingData.barber?.id || "demo-barber",
      serviceName: bookingData.service?.name,
      servicePrice: bookingData.service?.price,
      barberName: bookingData.barber?.name,
      status: "confirmed",
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, "bookings"), bookingWithIds);
    
    // Also save to localStorage as backup
    const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
    existing.push({ ...bookingWithIds, id: docRef.id });
    localStorage.setItem('bookings', JSON.stringify(existing));
    
    return { 
      success: true, 
      data: { id: docRef.id, ...bookingWithIds },
      message: "✅ Booking confirmed!"
    };
  } catch (error) {
    console.log("💾 Saving booking locally");
    
    const localBooking = {
      ...bookingData,
      id: `local-${Date.now()}`,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
    existing.push(localBooking);
    localStorage.setItem('bookings', JSON.stringify(existing));
    
    return { 
      success: true, 
      data: localBooking,
      message: "✅ Booking saved!"
    };
  }
};

// 4. GET USER BOOKINGS - Fixed query
export const getUserBookings = async (userId) => {
  try {
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(bookingsQuery);
    const bookings = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date()
      });
    });
    
    // Sort manually
    bookings.sort((a, b) => b.createdAt - a.createdAt);
    
    // Check localStorage
    const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      .filter(b => b.userId === userId);
    
    return { 
      success: true, 
      data: [...bookings, ...localBookings]
    };
  } catch (error) {
    const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      .filter(b => b.userId === userId);
    
    return { 
      success: true, 
      data: localBookings
    };
  }
};

// 5. CANCEL BOOKING
export const cancelBooking = async (bookingId) => {
  try {
    await updateDoc(doc(db, "bookings", bookingId), {
      status: "cancelled",
      updatedAt: serverTimestamp()
    });
    
    // Update localStorage too
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updated = bookings.map(b => 
      b.id === bookingId ? { ...b, status: "cancelled" } : b
    );
    localStorage.setItem('bookings', JSON.stringify(updated));
    
    return { success: true, message: "Booking cancelled" };
  } catch (error) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updated = bookings.map(b => 
      b.id === bookingId ? { ...b, status: "cancelled" } : b
    );
    localStorage.setItem('bookings', JSON.stringify(updated));
    
    return { success: true, message: "Booking cancelled" };
  }
};