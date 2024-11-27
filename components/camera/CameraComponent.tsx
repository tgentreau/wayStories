import {CameraType, CameraView, useCameraPermissions} from "expo-camera";
import {useEffect, useRef, useState} from "react";
import {Animated, Button, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import {getAuth} from "firebase/auth";
import {uploadFile} from "@/config/aws/uploadFile";
import {createPicture} from "@/services/pictureService";


export default function CameraComponent() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const cameraRef = useRef<CameraView>(null);
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

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

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
        Animated.timing(rotation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            rotation.setValue(0);
        });
    }

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const animatedStyle = {
        transform: [{rotate: rotateInterpolate}],
    };

    async function takePicture() {
        if (cameraRef.current) {
            const pictureOptions = {
                exif: true,
                additionalExif: location ? {
                    GPSLatitude: location.coords.latitude,
                    GPSLongitude: location.coords.longitude,
                    GPSAltitude: location.coords.altitude,
                } : undefined,
                // base64: true,
            };
            const photo = await cameraRef.current.takePictureAsync(pictureOptions);
            if (photo && !photo.base64 && photo.exif.GPSLongitude && photo.exif.GPSLatitude) {
                await savePicture(photo);
            }
        }
    }

    const getFileName = (path: string) => {
        const segments = path.split('/');
        return segments[segments.length - 1];
    };

    const savePicture = async (photo: any) => {
        const auth = getAuth();
        const user = auth.currentUser!;
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        const awsResponse = await uploadFile(photo);
        await createPicture(
            user.uid,
            new Date().toISOString(),
            awsResponse,
            photo.exif.GPSLatitude,
            photo.exif.GPSLongitude,
            'tripId',
            getFileName(photo.uri)
        );
    };

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
                    <FontAwesome name="camera" size={40} color="white"/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonRotate, animatedStyle]} onPress={toggleCameraFacing}>
                    <FontAwesome name="refresh" size={24} color="white"/>
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