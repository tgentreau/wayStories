import { db } from "@/config/firebase/firebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

const picturesCollectionRef = collection(db, "pictures");

const getPictureById = async (id: string) =>  {
    const userCollectionQuery = query(picturesCollectionRef, where("pictureId", "==", id));
    const userCollectionSnapshot = await getDocs(userCollectionQuery);
    return userCollectionSnapshot.docs[0].data();
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



export { getPictureById, createPicture };