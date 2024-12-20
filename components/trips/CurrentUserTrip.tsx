import { useEffect, useState } from "react";
import { getCurrentTrip } from "@/services/tripService";
import LoadingScreen from "../utils/LoadingScreen";
import { Text } from '@rneui/themed';
import { StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from 'expo-image';
import {Button} from "@rneui/base";
import {TripDTO, TripFirestore} from "@/types/trip";
import {getAllPicturesByUserIdAndTripId} from "@/services/pictureService";
import { Picture } from "@/types/picture";

export default function CurrentUserTrip() {
    const [trip, setTrip] = useState<TripDTO>();
    const [loading, setLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        async function fetchTrip(): Promise<void> {
            try {
                const tripData: TripFirestore | null = await getCurrentTrip();
                if (tripData && tripData.data.userId && tripData.id) {
                    const pictures: Picture[] = await getAllPicturesByUserIdAndTripId(tripData.data.userId, tripData.id);
                    setTrip({
                        name: tripData.data.name,
                        pictures: pictures ?? [],
                        startDate: tripData.data.startDate,
                        endDate: ''
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('erreur lors de la récupération du current trip : ', error);
                setLoading(false);
            }
        }

        fetchTrip();
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
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
                                            source={{ uri: trip.pictures[0].link }}
                                        />
                                        :
                                        <FontAwesome name="photo" size={30} color="gray" />
                                    }
                                </View>
                            </View>
                            <View style={styles.linkRound}>
                            </View>
                            <View style={styles.smallRoundContainer}>
                                <View style={styles.smallRound} />
                            </View>
                        </View>
                        <Text
                            style={styles.tripDate}>{trip.startDate} - {trip.endDate !== '' ? trip.endDate : 'En cours'}</Text>
                    </View>
                }
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Trip Details</Text>
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </>
    );
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        marginBottom: 20,
    },
});