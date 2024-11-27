import { Text } from "@rneui/themed";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { View } from "@/components/Themed";
import { getUserById } from "@/services/userService";

export default function UserName() {
    const [userLogged, setUserLogged] = useState<any>(null);
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        const auth = getAuth();
        setUserLogged(auth.currentUser);
    }, []);

    useEffect(() => {
        if (userLogged) {
            fetchUser();
        }
    }, [userLogged]);

    const fetchUser = async () => {
        if (userLogged) {
            const user = await getUserById(userLogged.uid);
            console.log('user', user);
            setUserName(user.username);
        }
    }

    return (
        <View>
            {
                !userName ?
                    <Text>Chargement...</Text>
                    :
                    <Text>{userName}</Text>
            }
        </View>
    );
}