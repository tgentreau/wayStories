import React, {useEffect, useState} from 'react';
import {Text} from '@rneui/themed';
import {getAllTrips} from '@/services/tripService';
import LoadingScreen from '../utils/LoadingScreen';
import {StyleSheet, View} from "react-native";
import {Image} from "expo-image";

export default function AllUserTrips() {

    const [trips, setTrips] = useState<TripDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTrips() {
            const tripsData = await getAllTrips();
            console.log('tripDatas ', tripsData);
            tripsData.forEach(trip => {
                setTrips(
                    [{
                        name: trip.name,
                        pictures: trip.pictures ?? [],
                        startDate: trip.startDate,
                        endDate: trip.endDate
                    }]
                )
            });
            setLoading(false);
        }

        fetchTrips();
    }, []);

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <View style={styles.mainContainer}>
            {trips.map((trip, index) => (
                <View key={index} style={styles.container}>
                    <View style={styles.tripContainer}>
                        {
                            trip.pictures[0] ?
                                <Image
                                    style={styles.image}
                                    source={{uri: trip.pictures[0]}}
                                />
                                :
                                null
                        }
                        <View style={styles.tripDataContainer}>
                            <Text style={styles.title}>{trip.name ?? 'name'}</Text>
                            <Text style={styles.photoCount}>{trip.pictures ? trip.pictures.length : '0'} photos</Text>
                            <Text style={styles.dates}>{trip.startDate} - {trip.endDate ?? '?'}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        width: '90%',
    },
    container: {
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 15,
        padding: 10,
        width: '100%',
        marginTop: 20,
        backgroundColor: '#f0f0f0',
    },
    tripContainer: {
        flexDirection: 'row',
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 10,
    },
    tripDataContainer: {
        marginStart: 10,
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    photoCount: {
        fontSize: 15,
        fontWeight: '200',
    },
    dates: {
        fontSize: 15,
        textAlign: 'right',
    }
})