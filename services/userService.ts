import { db } from "@/config/firebase/firebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";


const getUserById = async (id: string) =>  {
    const userCollectionRef = collection(db, "users");
    const userCollectionQuery = query(userCollectionRef, where("userId", "==", id));
    const userCollectionSnapshot = await getDocs(userCollectionQuery);
    return userCollectionSnapshot.docs[0].data();
}

const createUser = async (userId: string, username: string) => {
    try {
        const userCollectionRef = collection(db, "users");
        await addDoc(userCollectionRef, {
            userId,
            username
        });
    } catch (error) {
        console.error("Erreur création utilisateur:", error);
    }
}

export { getUserById, createUser };