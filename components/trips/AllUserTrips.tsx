import React, { useEffect, useState } from 'react';
import { View, Text } from '../Themed';
import { getAllTrips } from '@/services/tripService';
import LoadingScreen from '../utils/LoadingScreen';

export default function AllUserTrips() {

    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTrips() {
            const tripsData = await getAllTrips();
            setTrips(tripsData);
            setLoading(false);
        }
        fetchTrips();
    }, []);

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <View>
            {trips.map((trip, index) => (
                <View key={index}>
                    <Text>{trip.name}</Text>
                    <Text>{trip.startDate} - {trip.endDate}</Text>
                </View>
            ))}
        </View>
    );
};