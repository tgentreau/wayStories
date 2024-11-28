import { db } from "@/config/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const tripsCollectionRef = collection(db, "trips");

const getAllTrips = async () => {
    const auth = getAuth();
    const tripsCollectionQuery = query(tripsCollectionRef, where("userId", "==", auth.currentUser?.uid), where("currentTrip", "==", false));
    const tripsCollectionSnapshot = await getDocs(tripsCollectionQuery);
    return tripsCollectionSnapshot.docs.map(doc => doc.data()) as Trip[];
}

const getCurrentTrip = async () => {
    const auth = getAuth();
    const tripsCollectionQuery = query(tripsCollectionRef, where("userId", "==", auth.currentUser?.uid), where("currentTrip", "==", true));
    const tripsCollectionSnapshot = await getDocs(tripsCollectionQuery);
    if (tripsCollectionSnapshot.empty) {
        return null;
    }
    return tripsCollectionSnapshot.docs[0].data() as Trip;
}

const getTripById = async (id: string) => {
    const tripsCollectionQuery = query(tripsCollectionRef, where("id", "==", id));
    const tripsCollectionSnapshot = await getDocs(tripsCollectionQuery);
    return tripsCollectionSnapshot.docs[0].data() as Trip;
}

const createTrip = async (trip: CreateTripData) => {
    try {
        await addDoc(tripsCollectionRef, trip);
    } catch (error) {
        console.error("Erreur création voyage:", error);
    }
}

const deleteTrip = async (id: string) => {
    await deleteDoc(doc(tripsCollectionRef, id));
    return;
}

export { getAllTrips, getTripById, createTrip, deleteTrip, getCurrentTrip };