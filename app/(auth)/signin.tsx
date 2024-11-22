import { View, StyleSheet } from "react-native";
import SigninForm from "@/components/auth/SigninForm";
import { Link } from "expo-router";
import { Text } from '@rneui/themed';

export default function SignIn() {
    return (
        <View style={styles.container}>
          <Text h3 style={styles.title}>Inscription</Text>
          <SigninForm />
          <Link href="/(auth)/login" style={styles.link}>
            Déjà un compte ? Se connecter
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