import React, {useEffect, useState} from 'react';
import {Text} from '@rneui/themed';
import {getAllTripsFinished} from '@/services/tripService';
import LoadingScreen from '../utils/LoadingScreen';
import {StyleSheet, View} from "react-native";
import {Image} from "expo-image";
import {TripDTO} from "@/types/trip";
import {getAllPicturesByUserIdAndTripId} from "@/services/pictureService";

export default function AllUserTrips() {

    const [trips, setTrips] = useState<TripDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTrips() {
            const tripsData = await getAllTripsFinished();

            const tripsTest: TripDTO[] = [];
            await Promise.all(tripsData.map(async (trip) => {
                const pictures = await getAllPicturesByUserIdAndTripId(trip.data.userId, trip.id);
                tripsTest.push({
                    name: trip.data.name,
                    pictures: pictures ?? [],
                    startDate: trip.data.startDate,
                    endDate: trip.data.endDate
                });
                // setTrips(
                //     [
                //         ...trips,
                //         {
                //             name: trip.data.name,
                //             pictures: pictures ?? [],
                //             startDate: trip.data.startDate,
                //             endDate: trip.data.endDate
                //         }
                //     ]
                // );
                // console.log('trips', [
                //     ...trips,
                //     {
                //         name: trip.data.name,
                //         pictures: pictures ?? [],
                //         startDate: trip.data.startDate,
                //         endDate: trip.data.endDate
                //     }
                // ]);
            }));
            setTrips(tripsTest);

            setLoading(false);
        }

        fetchTrips();
    }, []);

    if (loading) {
        return <LoadingScreen/>
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
                                    source={{uri: trip.pictures[0].link}}
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