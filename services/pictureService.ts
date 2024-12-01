import {db} from "@/config/firebase/firebaseConfig";
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";
import {Picture} from "@/types/picture";
import {DocumentData, Query, QuerySnapshot} from "@firebase/firestore";

const picturesCollectionRef = collection(db, "pictures");

const getPictureById = async (id: string): Promise<Picture> => {
    const userCollectionQuery: Query<DocumentData, DocumentData> = query(picturesCollectionRef, where("pictureId", "==", id));
    const userCollectionSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(userCollectionQuery);
    return userCollectionSnapshot.docs[0].data() as Picture;
}

const getAllPicturesByUserIdAndTripId = async (userId: string, tripId: string): Promise<Picture[]> => {
    const userCollectionQuery: Query<DocumentData, DocumentData> = query(picturesCollectionRef, where("userId", "==", userId), where("tripId", "==", tripId));
    const userCollectionSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(userCollectionQuery);
    const picturesUnsorted: Picture[] = userCollectionSnapshot.docs.map(doc => doc.data()) as Picture[];
    return picturesUnsorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

const createPicture = async (
    userId: string,
    date: string,
    link: string,
    localisationX: number,
    localisationY: number,
    tripId: string,
    name: string,
    country?: string
): Promise<Picture> => {
    const newPicture: Picture = {
        userId,
        date,
        link,
        localisationX,
        localisationY,
        tripId,
        name,
        country
    }

    await addDoc(picturesCollectionRef, newPicture);
    return newPicture as Picture;
}

export {getPictureById, createPicture, getAllPicturesByUserIdAndTripId};