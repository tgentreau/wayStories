import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import TripsMap from '@/components/map/tripsMap';
import { Button } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { Trip, TripFirestore } from '@/types/trip';
import { getCurrentTrip } from '@/services/tripService';
import { Picture } from '@/types/picture';
import { getAllPicturesByUserIdAndTripId } from '@/services/pictureService';
import LoadingScreen from '@/components/utils/LoadingScreen';

export default function MapScreen() {

  const [trip, setTrip] = useState<Trip | null>(null);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const tripData: TripFirestore = await getCurrentTrip();
      setTrip(tripData.data);
      if (trip) {
        console.log(trip)
          const picturesSorted: Picture[] = await getAllPicturesByUserIdAndTripId(trip.userId, tripData.id);
          setPictures(picturesSorted);
          setLoading(false);
      }
    }
    fetchData();
  }, [])

  if (loading) {
    return <LoadingScreen />;
  }

  if(trip) {
    return (
      <View style={styles.container}>
        <Button>ALLO</Button>
        <TripsMap trip={trip} pictures={pictures}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
