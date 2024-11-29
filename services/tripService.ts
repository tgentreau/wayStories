import { db } from "@/config/firebase/firebaseConfig";
import { AllTrips, CreateTripData, Trip, TripFirestore } from "@/types/trip";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, and } from "firebase/firestore";

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

const getAllTripsFinished = async (): Promise<TripFirestore[]> => {
    const auth = getAuth();
    const tripsCollectionQuery = query(tripsCollectionRef, where("userId", "==", auth.currentUser?.uid), where("currentTrip", "==", false));
    const tripsCollectionSnapshot = await getDocs(tripsCollectionQuery);
    const trips: TripFirestore[] = []
    for (const doc of tripsCollectionSnapshot.docs) {
        trips.push({ id: doc.id, data: doc.data() as Trip });
    }
    return trips;
}

const getTripByName = async (name: string): Promise<TripFirestore> => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) {
        console.log("User not authenticated");
        throw new Error("User not authenticated");
    }

    const tripsCollectionQuery = query(tripsCollectionRef,
        where("userId", "==", userId),
        where("name", "==", name.trim())
    );
    const tripsCollectionSnapshot = await getDocs(tripsCollectionQuery);
    if (!tripsCollectionSnapshot.empty) {
        const tripDoc = tripsCollectionSnapshot.docs[0];
        console.log(tripDoc.data());
        return {
            id: tripsCollectionSnapshot.docs[0].id,
            data: tripsCollectionSnapshot.docs[0].data() as Trip
        };
    } else {
        console.log("Trip not found");
        throw new Error("Trip not found");
    }
};

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

export {getAllTripsFinished, getTripById, createTrip, deleteTrip, getCurrentTrip, getAllTripsByUser, getTripByName, updateTrip };