import {CameraCapturedPicture, CameraType, CameraView, useCameraPermissions} from "expo-camera";
import {useCallback, useEffect, useRef, useState} from "react";
import {Animated, Button, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import {Auth, getAuth, User} from "firebase/auth";
import {uploadFile} from "@/config/aws/uploadFile";
import {createPicture} from "@/services/pictureService";
import {getCurrentTrip, updateTrip} from "@/services/tripService";
import CustomDialogComponent from "@/components/dialog/CustomDialogComponent";
import {useFocusEffect} from "@react-navigation/core";
import {Trip, TripFirestore} from "@/types/trip";
import {Picture} from "@/types/picture";

export default function CameraComponent() {
    const BASE_URL_AWS: string = "https://waystory.s3.eu-north-1.amazonaws.com/";
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [, setLocation] = useState<Location.LocationObject | null>(null);
    const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
    const [isDialogVisible, setDialogVisible] = useState<boolean>(true);
    const [country, setCountry] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null);
    const rotation = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const tripData: TripFirestore | null = await getCurrentTrip();
                if (tripData) {
                    setCurrentTrip(tripData.data);
                    if (!tripData.data) {
                        setDialogVisible(true);
                    }
                }
            })();
        }, [])
    );

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }
        })();
    }, [currentTrip]);

    if (!permission) {
        return <View/>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Nous avons besoin de votre permission pour utiliser la caméra et la
                    localisation.</Text>
                <Button onPress={requestPermission} title="grant permission"/>
            </View>
        );
    }

    function toggleCameraFacing(): void {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
        Animated.timing(rotation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            rotation.setValue(0);
        });
    }

    const rotateInterpolate: Animated.AnimatedInterpolation<string | number> = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const animatedStyle = {
        transform: [{rotate: rotateInterpolate}],
    };

    async function takePicture(): Promise<void> {
        if (cameraRef.current) {
            let location: Location.LocationObject = await Location.getCurrentPositionAsync({});
            let reverseGeocode: Location.LocationGeocodedAddress[] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            if (reverseGeocode.length > 0) {
                setCountry(reverseGeocode[0].country);
            }
            setLocation(location);

            const pictureOptions = {
                exif: true,
                additionalExif: location ? {
                    GPSLatitude: location.coords.latitude,
                    GPSLongitude: location.coords.longitude,
                    GPSAltitude: location.coords.altitude,
                } : undefined
            };
            const photo: CameraCapturedPicture | undefined = await cameraRef.current.takePictureAsync(pictureOptions);
            if (photo && photo.exif.GPSLongitude && photo.exif.GPSLatitude) {
                await savePicture(photo);
            }
        }
    }

    const getFileName = (path: string): string => {
        const segments = path.split('/');
        return segments[segments.length - 1];
    };

    const savePicture = async (photo: CameraCapturedPicture): Promise<void> => {
        if (currentTrip) {
            const auth: Auth = getAuth();
            const user: User = auth.currentUser!;
            await uploadFile(photo);
            const tripId: string = await getCurrentTrip().then((trip) => trip ? trip.id : "");
            const name: string = getFileName(photo.uri)
            const picture: Picture = await createPicture(
                user.uid,
                photo.exif.DateTimeOriginal,
                BASE_URL_AWS + name,
                photo.exif.GPSLatitude,
                photo.exif.GPSLongitude,
                tripId,
                name,
                country!
            );

            await updateTrip({
                ...currentTrip,
                pictures: [
                    ...(currentTrip.pictures || []),
                    picture
                ]
            });
        }
        await MediaLibrary.saveToLibraryAsync(photo.uri);
    };

    const handleCloseDialog = (): void => {
        setDialogVisible(false);
    };

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                {!currentTrip ?
                    <CustomDialogComponent
                        visible={isDialogVisible}
                        message={"Vous n'avez pas de voyage en cours, les photos seront enregistrées dans votre galerie."}
                        onClose={handleCloseDialog}
                    />
                    : null
                }
                <TouchableOpacity
                    style={styles.buttonCamera}
                    onPress={takePicture}
                >
                    <FontAwesome
                        name="camera"
                        size={40}
                        color="white"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.buttonRotate, animatedStyle]}
                    onPress={toggleCameraFacing}
                >
                    <FontAwesome
                        name="refresh"
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    buttonRotate: {
        position: 'absolute',
        right: 40,
        bottom: 64,
    },
    buttonCamera: {
        flex: 1,
        position: 'absolute',
        bottom: 64,
        alignSelf: 'center',
    }
});