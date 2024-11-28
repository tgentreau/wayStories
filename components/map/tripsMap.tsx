import { Picture } from "@/types/picture";
import { Trip } from "@/types/trip";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import LoadingScreen from "../utils/LoadingScreen";

interface TripsMapProps {
    trip: Trip;
    pictures: Picture[];
}

const TripsMap: React.FC<TripsMapProps> = ({ trip, pictures }) => {
    const [loading, setLoading] = useState(true);
    const [visibleMarkers, setVisibleMarkers] = useState<number[]>([]);
    const [progress] = useState(new Animated.Value(0));
    const [currentProgress, setCurrentProgress] = useState(0);
    
    useEffect(() => {
        if (pictures.length === 0) return;

        const animationDuration = 1000;
        const totalDuration = pictures.length * animationDuration;

        setVisibleMarkers([]);
        progress.setValue(0);

        const pathAnimation = Animated.timing(progress, {
            toValue: 1,
            duration: totalDuration,
            useNativeDriver: false
        });

        const listener = progress.addListener(({ value }) => {
            setCurrentProgress(value);
            const markersToShow = Math.ceil(value * pictures.length);
            setVisibleMarkers(Array.from({ length: markersToShow }, (_, i) => i));
        });

        pathAnimation.start();

        return () => {
            pathAnimation.stop();
            progress.removeListener(listener);
            progress.setValue(0);
        };
    }, [pictures.length]);


    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: pictures[0]?.localisationX || 44.837789,
                    longitude: pictures[0]?.localisationY || -0.57918,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                {pictures.map((picture, index) => (
                    visibleMarkers.includes(index) && (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: picture.localisationX,
                                longitude: picture.localisationY,
                            }}
                            title={picture.name}
                        >
                            <Image
                                source={{uri: picture.link}}
                                style={styles.markerImage}
                            />
                        </Marker>
                    )
                ))}
                <Polyline
                    coordinates={pictures.slice(0, Math.ceil(currentProgress * pictures.length)).map(picture => ({
                        latitude: picture.localisationX,
                        longitude: picture.localisationY,
                    }))}
                    strokeColor="#000"
                    strokeWidth={2}
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    map: {
        width: '100%',
        height: '100%'
    },
    markerImage: {
        width: 100,
        height: 100,
    }
});

export default TripsMap