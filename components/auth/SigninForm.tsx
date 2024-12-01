import {createUser} from "@/services/userService";
import {SignInFormInputs} from "@/types/user";
import {Button, Input} from "@rneui/themed";
import {Router, useRouter} from "expo-router";
import {Auth, createUserWithEmailAndPassword, getAuth, UserCredential} from "firebase/auth";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {StyleSheet, View} from "react-native";

export default function SigninForm() {

    const { control, handleSubmit, formState: { errors }, watch } = useForm<SignInFormInputs>()
    const [loading, setLoading] = useState<boolean>(false);
    const password: string = watch('password');
    const router: Router = useRouter();

    const onSubmit = async (data: SignInFormInputs): Promise<void> => {
        try {
            setLoading(true);
            const auth: Auth = getAuth()
            const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await createUser(userCredential.user.uid, data.username);
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Sign in form error : ', error);
        } finally {
            setLoading(false);
        }
    }

    return ( 
        <View style={styles.container}>
        <Controller
          control={control}
          name="username"
          rules={{
            required: 'Pseudo requis'
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Pseudonyme"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.username?.message}
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