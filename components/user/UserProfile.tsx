import {Text} from "@rneui/themed";
import {useEffect, useState} from "react";
import {StyleSheet, View} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {getAuth} from "firebase/auth";
import {getUserById} from "@/services/userService";
import {Image} from 'expo-image';

export default function UserProfile() {
    const [userLogged, setUserLogged] = useState<any>(null);
    const [userName, setUserName] = useState<string>('');
    const [profilePictureLink, setProfilePictureLink] = useState<string>('');
    const [bio, setBio] = useState<string>();
    const [countryCount, setCountryCount] = useState<number>(0);
    const [waystoryCount, setWaystoryCount] = useState<number>(0);

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
            setUserName(user.username);
        }
    }

    return (
        <>
            <View style={styles.container}>
                {
                    !userName ?
                        <Text>Chargement...</Text>
                        :
                        <View style={styles.userNameContainer}>
                            <View style={styles.roundContainer}>
                                {
                                    profilePictureLink ?
                                        <Image source={{uri: profilePictureLink}} style={styles.image}/>
                                        :
                                        <FontAwesome name="photo" size={50} color="gray"/>
                                }
                            </View>
                            <Text style={styles.name}>{userName}</Text>
                        </View>
                }
                <Text style={styles.bioTitle}>Biographie :</Text>
                <Text style={styles.bio}>{bio ? bio : '...'}</Text>
            </View>
            <View style={styles.userNameContainer}>
                <View style={[styles.statContainer, styles.rightBorder]}>
                    <Text style={styles.counter}>{countryCount}</Text>
                    <Text>Pays</Text>
                </View>
                <View style={styles.statContainer}>
                    <Text style={styles.counter}>{waystoryCount}</Text>
                    <Text>Waystories</Text>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    userNameContainer: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
    },
    roundContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: 40,
        fontWeight: 'bold',
        marginStart: 20,
    },
    bioTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        marginStart: 20,
        marginBottom: 5,
    },
    bio: {
        fontSize: 13,
        marginStart: 20,
        marginEnd: 20,
        marginBottom: 20,
    },
    statContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
    },
    counter: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    rightBorder: {
        borderRightWidth: 1,
        borderRightColor: 'gray',
    }
});