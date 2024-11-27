import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";

export default function TripsMap() {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%'
    },
    map: {
        width: '100%',
        height: '100%'
    },
  });