import { db } from "@/config/firebase/firebaseConfig";
import { AllTrips, CreateTripData, Trip, TripFirestore } from "@/types/trip";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const tripsCollectionRef = collection(db, "trips");

const getAllTripsByUser = async (): Promise<AllTrips[]> => {
    const auth = getAuth();
    const tripsCollectionQuery = query(tripsCollectionRef, where("userId", "==", auth.currentUser?.uid));
    const tripsCollectionSnapshot = await getDocs(tripsCollectionQuery);
    const trips: AllTrips[] = []
    for (const doc of tripsCollectionSnapshot.docs) {
        trips.push({ id: doc.id, data: doc.data() as Trip[] });
    }
    return trips;
}

const getAllTripsFinished = async (): Promise<Trip[]> => {
    const auth = getAuth();
    const tripsCollectionQuery = query(tripsCollectionRef, where("userId", "==", auth.currentUser?.uid), where("currentTrip", "==", false));
    const tripsCollectionSnapshot = await getDocs(tripsCollectionQuery);
    return tripsCollectionSnapshot.docs.map(doc => doc.data()) as Trip[];
}

const getTripByName = async (name: string): Promise<Trip> => {
    const auth = getAuth();
    const tripsCollectionQuery = query(tripsCollectionRef, where("name", "==", name), where("userId", "==", auth.currentUser?.uid));
    const tripsCollectionSnapshot = await getDocs(tripsCollectionQuery);
    return tripsCollectionSnapshot.docs[0].data() as Trip;
}

const getCurrentTrip = async (): Promise<TripFirestore> => {
    const auth = getAuth();
    const tripsCollectionQuery = query(tripsCollectionRef, where("userId", "==", auth.currentUser?.uid), where("currentTrip", "==", true));
    const tripsCollectionSnapshot = await getDocs(tripsCollectionQuery);
    return {
        id: tripsCollectionSnapshot.docs[0].id, 
        data: tripsCollectionSnapshot.docs[0].data() as Trip
    };
}

const getTripById = async (id: string): Promise<Trip> => {
    const tripsCollectionQuery = query(tripsCollectionRef, where("id", "==", id));
    const tripsCollectionSnapshot = await getDocs(tripsCollectionQuery);
    return tripsCollectionSnapshot.docs[0].data() as Trip;
}

const createTrip = async (trip: CreateTripData): Promise<void> => {
    await addDoc(tripsCollectionRef, trip);
}

const deleteTrip = async (id: string): Promise<void> => {
    await deleteDoc(doc(tripsCollectionRef, id));
}

export { getAllTripsFinished, getTripById, createTrip, deleteTrip, getCurrentTrip, getAllTripsByUser, getTripByName };