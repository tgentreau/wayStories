import { StyleSheet, Text, TextInput } from 'react-native';
import { View } from '@/components/Themed';
import TripsMap from '@/components/map/tripsMap';
import { Button } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { Trip, TripFirestore } from '@/types/trip';
import { getCurrentTrip, getTripByName } from '@/services/tripService';
import { Picture } from '@/types/picture';
import { getAllPicturesByUserIdAndTripId } from '@/services/pictureService';
import LoadingScreen from '@/components/utils/LoadingScreen';

export default function MapScreen() {

  const [trip, setTrip] = useState<Trip | null>(null);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const tripData: TripFirestore = await getCurrentTrip();
        if (tripData.data) {
          setTrip(tripData.data);
          const picturesSorted: Picture[] = await getAllPicturesByUserIdAndTripId(tripData.data.userId, tripData.id);
          setPictures(picturesSorted);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const tripData: TripFirestore = await getTripByName(search);
      setTrip(tripData.data);
      const picturesSorted: Picture[] = await getAllPicturesByUserIdAndTripId(tripData.data.userId, tripData.id);
      setPictures(picturesSorted);
    } catch (error) {
      console.error("Error fetching trip by name: ", error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <LoadingScreen />;
  }

  if (trip) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Rechercher votre WayStory préférée"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
        <TripsMap trip={trip} pictures={pictures} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher un voyage par nom"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
      />
      <Text>Aucun voyage trouvé</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
    width: '90%',
  },
});
