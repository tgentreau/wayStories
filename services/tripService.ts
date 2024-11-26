import { db } from "@/config/firebase/firebaseConfig";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const tripsCollectionRef = collection(db, "trips");

const getAllTrips = async () => {
    const userCollectionSnapshot = await getDocs(tripsCollectionRef);
    const trips = userCollectionSnapshot.docs.map(doc => doc.data());
    return trips
}

const getTripById = async (id: string) => {
    const userCollectionQuery = query(tripsCollectionRef, where("id", "==", id));
    const userCollectionSnapshot = await getDocs(userCollectionQuery);
    return userCollectionSnapshot.docs[0].data();
}

const createTrip = async (trip: Trip) => {
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

export { getAllTrips, getTripById, createTrip, deleteTrip };