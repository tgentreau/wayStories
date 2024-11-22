import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UserLogin } from "@/types/user";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Router, useRouter } from "expo-router";
import { View, StyleSheet} from "react-native";
import { Button, Input } from "@rneui/themed";

export default function LoginForm() {
    const { control, handleSubmit, formState: { errors } } = useForm<UserLogin>();
    const [loading, setLoading] = useState(false);
    const router: Router = useRouter();

    const onSubmit = async (data: UserLogin) => {
        try {
            setLoading(true);
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, data.email, data.password);
            router.replace('/(tabs)');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
        <Controller
            control={control}
            name="email"
            rules={{
            required: 'Email requis',
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email invalide'
            }
            }}
            render={({ field: { onChange, value } }) => (
            <Input
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
            />
            )}
        />

        <Controller
            control={control}
            name="password"
            rules={{
            required: 'Mot de passe requis',
            minLength: {
                value: 8,
                message: 'Le mot de passe doit contenir au moins 8 caractères'
            }
            }}
            render={({ field: { onChange, value } }) => (
            <Input
                placeholder="Mot de passe"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
            />
            )}
        />

        <Button
            title="Se connecter"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            containerStyle={styles.buttonContainer}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      padding: 20,
      width: '100%',
    },
    buttonContainer: {
      marginTop: 20,
    }
  });