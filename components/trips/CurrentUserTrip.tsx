import {useEffect, useState} from "react";
import {getCurrentTrip} from "@/services/tripService";
import LoadingScreen from "../utils/LoadingScreen";
import {Text} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Image} from 'expo-image';

export default function CurrentUserTrip() {
    const [trip, setTrip] = useState<TripDTO>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTrip() {
            try {
                const tripData = await getCurrentTrip();
                if (tripData) {
                    setTrip({
                        name: tripData.name,
                        pictures: tripData.pictures ?? [],
                        startDate: tripData.startDate,
                        endDate: ''
                    })
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }

        fetchTrip();
    }, []);

    if (loading) {
        return <LoadingScreen/>
    }

    return (
        <View style={styles.container}>
            {!trip ?
                <Text style={styles.tripName}>Pas de WayStory en cours</Text>
                :
                <View style={styles.tripContainer}>
                    <Text style={styles.tripName}>{trip.name ?? 'name'}</Text>
                    <View style={styles.imageContainer}>
                        <View style={styles.roundContainer}>
                            <View style={styles.roundImageContainer}>
                                {trip.pictures[0] ?
                                    <Image
                                        style={styles.image}
                                        source={{uri: trip.pictures[0]}}
                                    />
                                    :
                                    <FontAwesome name="photo" size={30} color="gray"/>
                                }
                            </View>
                        </View>
                        <View style={styles.linkRound}>
                        </View>
                        <View style={styles.smallRoundContainer}>
                            <View style={styles.smallRound}/>
                        </View>
                    </View>
                    <Text style={styles.tripDate}>{trip.startDate} - {trip.endDate !== '' ? trip.endDate : 'En cours'}</Text>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 15,
        padding: 10,
        width: '90%',
        marginTop: 20,
        backgroundColor: '#f0f0f0',
    },
    tripContainer: {
        flexDirection: 'column',
        marginHorizontal: 10,
        gap: 10
    },
    tripName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    tripDate: {
        fontSize: 15,
        textAlign: 'right',
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roundContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    roundImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    image: {
        height: '100%',
        width: '100%',
    },
    linkRound: {
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 3,
        width: 80,
        marginStart: -5,
    },
    smallRoundContainer: {
        marginStart: -15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallRound: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'black',
    },
})