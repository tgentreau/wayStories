import {Button, Input} from '@rneui/themed';
import {getAuth} from 'firebase/auth';
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

export default function EditUserProfileForm() {
    const {control, handleSubmit, formState: {errors}} = useForm<CreateTripForm>();
    const [loading, setLoading] = useState(false);
    const [newUserProfile, setNewUserProfile] = useState<UserProfilEdited | null>(null);
    const [imageProfile, setImageProfile] = useState<ImagePickerSuccessResult | undefined>(undefined);
    const [currentImageProfile, setCurrentImageProfile] = useState<string | undefined>(undefined);
    const [userName, setUserName] = useState<string | undefined>(undefined);
    const [bio, setBio] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchUser = async () => {
            const auth = getAuth();
            if (auth.currentUser) {
                const user: UserProfilEdited = await getUserById(auth.currentUser?.uid);
                setCurrentImageProfile(user.profilePictureLink);
                setUserName(user.username);
                setBio(user.biographie);
            }
        }

        fetchUser();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            console.log('result : ', result);
            setImageProfile(result);
        }
    };

    const onValidateEdit = async () => {
        try {
            setLoading(true);
            if (imageProfile) {
                const response = await uploadFile(imageProfile.assets[0]);
                setCurrentImageProfile(response.Location);
                setNewUserProfile({
                    ...newUserProfile,
                    profilePictureLink: response.Location
                })
            }

            setNewUserProfile((prevState) => {
                console.log('prevState ', prevState);
                console.log('bio ', bio);
                return {
                    ...newUserProfile,
                    ...prevState,
                    username: userName,
                    biographie: bio
                }
            })
            console.log(bio);
            console.log(newUserProfile);

            if (newUserProfile) {
                updateUser(newUserProfile);
                router.replace('/(tabs)');
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onChangeUserName = (name: string) => {
        setUserName(name);
    };

    const onChangeBio = (bio: string) => {
        setBio(bio);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.circle} onPress={pickImage}>
                {
                    imageProfile ?
                        <Image
                            source={{uri: imageProfile.assets[0].uri}}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                            }}
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
                buttonStyle={{
                    backgroundColor: '#AA0101',
                    borderColor: 'white',
                    borderRadius: 20,
                    padding: 20,
                }}
                containerStyle={{
                    marginHorizontal: 20,
                    marginVertical: 20,
                    width: '90%',
                }}
                titleStyle={{
                    fontWeight: 'bold'
                }}
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
    textArea: {
        height: 150,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10
    }
});