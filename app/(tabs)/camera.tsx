import {StyleSheet} from 'react-native';
import {View} from '@/components/Themed';
import CameraComponent from "@/components/camera/CameraComponent";

export default function CameraScreen() {
    return (
        <View style={styles.container}>
            <CameraComponent/>
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
