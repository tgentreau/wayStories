import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import AllCurrentUserTrips from '@/components/trips/AllUserTrips';
import CurrentUserTrip from '@/components/trips/CurrentUserTrip';
import { Button } from '@rneui/base';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Button 
        title="Créer une nouvelle WayStory"
        buttonStyle={{
          backgroundColor: 'black',
          borderWidth: 2,
          borderColor: 'white',
          borderRadius: 30,
        }}
        containerStyle={{
          width: 250,
          marginHorizontal: 20,
          marginVertical: 10,
        }}
        titleStyle={{ fontWeight: 'bold' }}
      
      />
      <Text style={styles.title}>Ma WayStory en cours</Text>
      <CurrentUserTrip />
      <Text style={styles.title}>Mes WayStories</Text>
      <AllCurrentUserTrips />
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
