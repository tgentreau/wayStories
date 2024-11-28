import {db} from "@/config/firebase/firebaseConfig";
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";

const userCollectionRef = collection(db, "users");

const getUserById = async (id: string) => {
    const userCollectionQuery = query(userCollectionRef, where("userId", "==", id));
    const userCollectionSnapshot = await getDocs(userCollectionQuery);
    return userCollectionSnapshot.docs[0].data();
}

const createUser = async (
    userId: string,
    username: string,
    biographie?: string,
    profilePictureLink?: string
) => {
    try {
        await addDoc(userCollectionRef, {
            userId,
            username,
            biographie,
            profilePictureLink,
        });
    } catch (error) {
        console.error("Erreur création utilisateur:", error);
    }
}

export {getUserById, createUser};