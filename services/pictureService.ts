import { db } from "@/config/firebase/firebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

const picturesCollectionRef = collection(db, "pictures");

const getPictureById = async (id: string) =>  {
    const userCollectionQuery = query(picturesCollectionRef, where("pictureId", "==", id));
    const userCollectionSnapshot = await getDocs(userCollectionQuery);
    return userCollectionSnapshot.docs[0].data();
}

const getAllPicturesByUserIdAndTripId = async (userId: string, tripId: string) => {
    const userCollectionQuery = query(picturesCollectionRef, where("userId", "==", userId), where("tripId", "==", tripId));
    const userCollectionSnapshot = await getDocs(userCollectionQuery);
    const picturesUnsorted: Picture[] = userCollectionSnapshot.docs.map(doc => doc.data()) as Picture[];
    return picturesUnsorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

const createPicture = async (
    userId: string,
    date: string,
    link: string,
    localisationX: string,
    localisationY: string,
    tripId: string,
    name: string,
    country: string
) => {
    try {
        await addDoc(picturesCollectionRef, {
            date,
            link,
            localisationX,
            localisationY,
            name,
            tripId,
            userId,
            country
        });
    } catch (error) {
        console.error("Erreur création de la photo:", error);
    }
}

export { getPictureById, createPicture, getAllPicturesByUserIdAndTripId };