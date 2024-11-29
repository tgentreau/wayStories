import {Button, Input} from '@rneui/themed';
import {Auth, getAuth} from 'firebase/auth';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {ImagePickerSuccessResult} from 'expo-image-picker';
import {uploadFile} from "@/config/aws/uploadFile";
import {UserProfilEdited} from "@/types/user";
import {getUserById, updateUser} from "@/services/userService";
import {router} from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Image} from 'expo-image';
import {CreateTripForm} from "@/types/trip";

export default function EditUserProfileForm() {
    const {handleSubmit} = useForm<CreateTripForm>();
    const [loading, setLoading] = useState(false);
    const [newUserProfile, setNewUserProfile] = useState<UserProfilEdited | null>(null);
    const [imageProfile, setImageProfile] = useState<ImagePickerSuccessResult | undefined>(undefined);
    const [currentImageProfile, setCurrentImageProfile] = useState<string | undefined>(undefined);
    const [userName, setUserName] = useState<string | undefined>(undefined);
    const [bio, setBio] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchUser = async () => {
            const auth: Auth = getAuth();
            if (auth.currentUser) {
                const user: UserProfilEdited = await getUserById(auth.currentUser?.uid);
                setCurrentImageProfile(user.profilePictureLink);
                setUserName(user.username);
                setBio(user.biographie);
            }
        }

        fetchUser();
    }, []);

    const pickImage = async (): Promise<void> => {
        let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageProfile(result);
        }
    };

    const onValidateEdit = async (): Promise<void> => {
        try {
            setLoading(true);
            let profilePictureLink: string | undefined = currentImageProfile;

            if (imageProfile) {
                const response = await uploadFile(imageProfile.assets[0]);
                profilePictureLink = response.location;
            }

            const updatedUserProfile: UserProfilEdited = {
                username: userName,
                biographie: bio,
                profilePictureLink: (profilePictureLink ? profilePictureLink : "")
            };

            await updateUser(updatedUserProfile);
            router.replace('/(tabs)');

        } catch (error) {
            console.error('Erreur pendant la validation du profile : ', error);
        } finally {
            setLoading(false);
        }
    }

    const onChangeUserName = (name: string): void => {
        setUserName(name);
    };

    const onChangeBio = (bio: string): void => {
        setBio(bio);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.circle} onPress={pickImage}>
                {
                    imageProfile ?
                        <Image
                            source={{uri: imageProfile.assets[0].uri}}
                            style={styles.image}
                        />
                        :
                        currentImageProfile ?
                            <Image
                                source={{uri: currentImageProfile}}
                                style={styles.image}
                            />
                            :
                            <FontAwesome name="camera" size={50} color="gray"/>
                }
            </TouchableOpacity>
            <Input
                placeholder="Nom d'utilisateur"
                keyboardType="default"
                autoCapitalize="none"
                onChangeText={onChangeUserName}
                value={userName}
            />
            <TextInput
                multiline={true}
                numberOfLines={4}
                style={styles.textArea}
                placeholder="Biographie"
                onChangeText={onChangeBio}
                value={bio}
            />
            <Button
                title="Valider"
                onPress={handleSubmit(onValidateEdit)}
                loading={loading}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                titleStyle={styles.buttonTitle}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: '100%',
        backgroundColor: '#fff',
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 'auto',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    textArea: {
        height: 150,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10
    },
    button: {
        backgroundColor: '#AA0101',
        borderColor: 'white',
        borderRadius: 20,
        padding: 20,
    },
    buttonContainer: {
        marginHorizontal: 20,
        marginVertical: 20,
        width: '90%',
    },
    buttonTitle: {
        fontWeight: 'bold'
    }
});