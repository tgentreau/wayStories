import {db} from "@/config/firebase/firebaseConfig";
import {addDoc, collection, doc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {UserProfilEdited} from "@/types/user";
import { getAuth } from "firebase/auth";


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

const updateUser = async (user: UserProfilEdited) => {
    try {
        const auth = getAuth();
        const userCollectionQuery = query(userCollectionRef, where("userId", "==", auth.currentUser?.uid));
        const userCollectionSnapshot = await getDocs(userCollectionQuery);
        const docId = userCollectionSnapshot.docs[0].id;
        const userDocRef = doc(userCollectionRef, docId);
        await updateDoc(userDocRef, user);
    } catch (error) {
        console.error("Erreur mise à jour utilisateur:", error);
    }
}

export {getUserById, createUser, updateUser};