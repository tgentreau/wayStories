import {StyleSheet} from 'react-native';

import {Text, View} from '@/components/Themed';
import AllCurrentUserTrips from '@/components/trips/AllUserTrips';
import CurrentUserTrip from '@/components/trips/CurrentUserTrip';
import {Button} from '@rneui/base';
import {Router, useRouter} from 'expo-router';
import UserProfile from "@/components/user/UserProfile";

export default function TabOneScreen() {

    const router: Router = useRouter();

    const onClick = () => {
        router.push('/modal');
    }

    return (
        <View style={styles.container}>
            <UserProfile/>
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
                titleStyle={{fontWeight: 'bold'}}
                onPress={onClick}
            />
            <Text style={styles.title}>Ma WayStory en cours</Text>
            <CurrentUserTrip/>
            <Text style={styles.title}>Mes WayStories</Text>
            <AllCurrentUserTrips/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
    image: {
        flex: 1,
        width: '100%',
        backgroundColor: '#0553',
    },
});
