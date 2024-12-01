import {db} from "@/config/firebase/firebaseConfig";
import {addDoc, collection, doc, DocumentData, getDocs, query, updateDoc, where} from "firebase/firestore";
import {UserProfilEdited} from "@/types/user";
import { Auth, getAuth } from "firebase/auth";
import { Query, QuerySnapshot, DocumentReference } from "@firebase/firestore";


const userCollectionRef = collection(db, "users");

const getUserById = async (id: string): Promise<DocumentData> => {
    const userCollectionQuery: Query<DocumentData, DocumentData> = query(userCollectionRef, where("userId", "==", id));
    const userCollectionSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(userCollectionQuery);
    return userCollectionSnapshot.docs[0].data();
}

const createUser = async (
    userId: string,
    username: string,
    biographieInput?: string,
    profilePictureLinkInput?: string
): Promise<void> => {
    try {
        const biographie = biographieInput ?? "";
        const profilePictureLink = profilePictureLinkInput ?? "";
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

const updateUser = async (user: UserProfilEdited): Promise<void> => {
    try {
        const auth: Auth = getAuth();
        const userCollectionQuery: Query<DocumentData, DocumentData> = query(userCollectionRef, where("userId", "==", auth.currentUser?.uid));
        const userCollectionSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(userCollectionQuery);
        const docId: string = userCollectionSnapshot.docs[0].id;
        const userDocRef: DocumentReference<DocumentData, DocumentData> = doc(userCollectionRef, docId);
        await updateDoc(userDocRef, user);
    } catch (error) {
        console.error("Erreur mise à jour utilisateur:", error);
    }
}

export {getUserById, createUser, updateUser};