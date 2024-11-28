import {db} from "@/config/firebase/firebaseConfig";
import {getAuth} from "firebase/auth";
import {collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, and} from "firebase/firestore";

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

const updateTrip = async (trip: Trip) => {
    try {
        const auth = getAuth();
        const tripCollectionQuery = query(tripsCollectionRef,
            where("userId", "==", auth.currentUser?.uid),
            where("currentTrip", "==", true));
        const tripCollectionSnapshot = await getDocs(tripCollectionQuery);
        const docId = tripCollectionSnapshot.docs[0].id;
        const tripDocRef = doc(tripsCollectionRef, docId);
        await updateDoc(tripDocRef, trip);
    } catch (error) {
        console.error("Erreur mise à jour de voyage:", error);
    }
}

export {getAllTrips, getTripById, createTrip, deleteTrip, getCurrentTrip, updateTrip};