import { db } from "@/config/firebase/firebaseConfig";
import { AllTrips, CreateTripData, Trip, TripFirestore } from "@/types/trip";
import { Auth, getAuth } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, and, Query, DocumentData, QuerySnapshot, DocumentReference } from "firebase/firestore";

const tripsCollectionRef = collection(db, "trips");

const getAllTripsByUser = async (): Promise<AllTrips[]> => {
    const auth: Auth = getAuth();
    const tripsCollectionQuery: Query<DocumentData, DocumentData> = query(tripsCollectionRef, where("userId", "==", auth.currentUser?.uid));
    const tripsCollectionSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(tripsCollectionQuery);
    const trips: AllTrips[] = []
    for (const doc of tripsCollectionSnapshot.docs) {
        trips.push({ id: doc.id, data: doc.data() as Trip[] });
    }
    return trips;
}

const getAllTripsFinished = async (): Promise<TripFirestore[]> => {
    const auth: Auth = getAuth();
    const tripsCollectionQuery: Query<DocumentData, DocumentData> = query(tripsCollectionRef, where("userId", "==", auth.currentUser?.uid), where("currentTrip", "==", false));
    const tripsCollectionSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(tripsCollectionQuery);
    const trips: TripFirestore[] = []
    for (const doc of tripsCollectionSnapshot.docs) {
        trips.push({ id: doc.id, data: doc.data() as Trip });
    }
    return trips;
}

const getTripByName = async (name: string): Promise<TripFirestore> => {
    const auth: Auth = getAuth();
    const userId: string | undefined = auth.currentUser?.uid;
    if (!userId) {
        console.log("User not authenticated");
        throw new Error("User not authenticated");
    }

    const tripsCollectionQuery: Query<DocumentData, DocumentData> = query(tripsCollectionRef,
        where("userId", "==", userId),
        where("name", "==", name.trim())
    );
    const tripsCollectionSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(tripsCollectionQuery);
    if (!tripsCollectionSnapshot.empty) {
        return {
            id: tripsCollectionSnapshot.docs[0].id,
            data: tripsCollectionSnapshot.docs[0].data() as Trip
        };
    } else {
        console.error("Trip not found");
        throw new Error("Trip not found");
    }
};

const getCurrentTrip = async (): Promise<TripFirestore> => {
    const auth: Auth = getAuth();
    const tripsCollectionQuery: Query<DocumentData, DocumentData> = query(tripsCollectionRef, where("userId", "==", auth.currentUser?.uid), where("currentTrip", "==", true));
    const tripsCollectionSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(tripsCollectionQuery);
    return {
        id: tripsCollectionSnapshot.docs[0].id,
        data: tripsCollectionSnapshot.docs[0].data() as Trip
    };
}

const getTripById = async (id: string): Promise<Trip> => {
    const tripsCollectionQuery: Query<DocumentData, DocumentData> = query(tripsCollectionRef, where("id", "==", id));
    const tripsCollectionSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(tripsCollectionQuery);
    return tripsCollectionSnapshot.docs[0].data() as Trip;
}

const createTrip = async (trip: CreateTripData): Promise<void> => {
    await addDoc(tripsCollectionRef, trip);
}

const deleteTrip = async (id: string): Promise<void> => {
    await deleteDoc(doc(tripsCollectionRef, id));
}

const updateTrip = async (trip: Trip) => {
    try {
        const auth: Auth = getAuth();
        const tripCollectionQuery: Query<DocumentData, DocumentData> = query(tripsCollectionRef,
            where("userId", "==", auth.currentUser?.uid),
            where("currentTrip", "==", true));
        const tripCollectionSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(tripCollectionQuery);
        const docId: string = tripCollectionSnapshot.docs[0].id;
        const tripDocRef: DocumentReference<DocumentData, DocumentData> = doc(tripsCollectionRef, docId);
        await updateDoc(tripDocRef, trip);
    } catch (error) {
        console.error("Erreur mise à jour de voyage:", error);
    }
}

export {getAllTripsFinished, getTripById, createTrip, deleteTrip, getCurrentTrip, getAllTripsByUser, getTripByName, updateTrip };