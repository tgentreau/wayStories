import { getAllPicturesByUserIdAndTripId } from "@/services/pictureService";
import { getCurrentTrip } from "@/services/tripService";
import { Picture } from "@/types/picture";
import { Trip, TripFirestore } from "@/types/trip";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import LoadingScreen from "../utils/LoadingScreen";

export default function TripsMap() {
    const [trip, setTrip] = useState<Trip>();
    const [loading, setLoading] = useState(true);
    const [pictures, setPictures] = useState<Picture[]>([]);

    useEffect(() => {
        async function fetchTrip() {
            try {
                const tripData: TripFirestore = await getCurrentTrip();
                setTrip(tripData.data);
                const picturesSorted: Picture[] = await getAllPicturesByUserIdAndTripId(tripData.data.userId, tripData.id);
                setPictures(picturesSorted);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        fetchTrip();
    }, [])

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: pictures[0].localisationX,
                    longitude: pictures[0].localisationY,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            />
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
  });