import LoginForm  from "@/components/auth/LoginForm";
import { Link } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Text } from '@rneui/themed';

export default function Login() {
    return (
        <View style={styles.container}>
            <Text h3 style={styles.title}>Connexion</Text>
            <LoginForm />
            <Link 
                href="../(auth)/signin"
                style={styles.link}
            >
                Pas encore de compte ? S'inscrire
            </Link>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      marginBottom: 30,
    },
    link: {
      marginTop: 20,
      color: '#2089dc',
    },
});