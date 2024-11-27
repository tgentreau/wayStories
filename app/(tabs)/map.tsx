import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import TripsMap from '@/components/map/tripsMap';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <TripsMap />
    </View>
  );
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
