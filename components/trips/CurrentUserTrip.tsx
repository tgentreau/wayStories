import { useEffect, useState } from "react";
import { getCurrentTrip } from "@/services/tripService";
import LoadingScreen from "../utils/LoadingScreen";
import { View, Text } from '../Themed';

export default function CurrentUserTrip() {
    const [trip, setTrip] = useState<Trip>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTrip() {
            const tripData: Trip = await getCurrentTrip();
            setTrip(tripData);
            setLoading(false);
        }
        fetchTrip();
    }, []);

    if (loading) {
        return <LoadingScreen />
    }

    if (!trip) {
        return <Text>Aucune WayStory en cours</Text>;
    }

    console.log("trip: ", trip);
    

    return (
        <View>
            <Text>{trip.name}</Text>
            <Text>{trip.startDate} - {trip.endDate}</Text>
        </View>
    )
}