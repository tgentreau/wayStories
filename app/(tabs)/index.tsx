import {ScrollView, StyleSheet, View} from 'react-native';
import {Text} from '@/components/Themed';
import AllUserTrips from '@/components/trips/AllUserTrips';
import CurrentUserTrip from '@/components/trips/CurrentUserTrip';
import {Button} from '@rneui/base';
import {Router, useRouter} from 'expo-router';
import UserProfile from "@/components/user/UserProfile";

export default function TabOneScreen() {

    const router: Router = useRouter();

    const onClick = (): void => {
        router.push('/formAddWaystory');
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
            >
                <UserProfile/>
                <Button
                    title="+ Ajouter une WayStory"
                    buttonStyle={{
                        backgroundColor: '#AA0101',
                        borderColor: 'white',
                        borderRadius: 20,
                        padding: 20,
                    }}
                    containerStyle={{
                        marginHorizontal: 20,
                        marginVertical: 10,
                        width: '90%',
                    }}
                    titleStyle={{
                        fontWeight: 'bold'
                    }}
                    onPress={onClick}
                />
                <CurrentUserTrip/>
                <Text style={styles.title}>Mes WayStories</Text>
                <AllUserTrips/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        width: '100%',
        marginHorizontal: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 20,
    },
});
