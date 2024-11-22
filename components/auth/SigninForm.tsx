import { SignInFormInputs } from "@/types/user";
import { Button, Input } from "@rneui/themed";
import { Router, useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, StyleSheet } from "react-native";

export default function SigninForm() {

    const { control, handleSubmit, formState: { errors }, watch } = useForm<SignInFormInputs>()
    const [loading, setLoading] = useState(false);
    const password: string = watch('password');
    const router: Router = useRouter();

    const onSubmit = async (data: SignInFormInputs) => {
        try {
            setLoading(true);
            const auth = getAuth()
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            router.replace('/(tabs)');
        } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
    }

    return ( 
        <View style={styles.container}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: 'Nom requis'
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Nom complet"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
            />
          )}
        />
  
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
              value: 6,
              message: 'Le mot de passe doit contenir au moins 6 caractères'
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
  
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Confirmation du mot de passe requise',
            validate: value => 
              value === password || 'Les mots de passe ne correspondent pas'
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Confirmer le mot de passe"
              secureTextEntry
              onChangeText={onChange}
              value={value}
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />
  
        <Button
          title="S'inscrire"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          containerStyle={styles.buttonContainer}
        />
      </View>
    )
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