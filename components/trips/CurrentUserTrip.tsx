import { useEffect, useState } from "react";
import { getCurrentTrip } from "@/services/tripService";
import LoadingScreen from "../utils/LoadingScreen";
import { View, Text } from '../Themed';
import { Trip, TripFirestore } from "@/types/trip";

export default function CurrentUserTrip() {
    const [trip, setTrip] = useState<Trip>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTrip() {
            try {
                const tripData: TripFirestore = await getCurrentTrip();
                setTrip(tripData.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        fetchTrip();
    }, []);

    if (loading) {
        return <LoadingScreen />
    }

    if (!trip) {
        return <Text>Aucune WayStory en cours</Text>;
    }

    return (
        <View>
            <Text>{trip.name}</Text>
            <Text>{trip.startDate} - {trip.endDate}</Text>
        </View>
    )
}