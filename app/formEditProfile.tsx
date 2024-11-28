import {View} from "@/components/Themed";
import {Platform, StyleSheet, TouchableOpacity} from "react-native";
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {StatusBar} from "expo-status-bar";
import EditUserProfileForm from "@/components/user/EditUserProfileForm";


export default function FormEditProfile() {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="black"/>
            </TouchableOpacity>

            <View style={styles.content}>
                <EditUserProfileForm/>
            </View>

            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 20,
        left: 20,
        zIndex: 1,
        padding: 10,
    },
});