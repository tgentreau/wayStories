import { createTrip } from '@/services/tripService';
import { CreateTripData, CreateTripForm } from '@/types/trip';
import { Button, Input } from '@rneui/themed';
import { Router, useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

export default function CreateWayStoryForm() {
    const { control, handleSubmit, formState: { errors } } = useForm<CreateTripForm>();
    const [loading, setLoading] = useState(false);
    const router: Router = useRouter();

    const onSubmit = async(data: CreateTripForm) => {
        try {
            setLoading(true);
            const auth = getAuth();
            if (auth.currentUser) {
                const tripToCreate: CreateTripData = {
                    name: data.name,
                    startDate: new Date().toDateString(),
                    endDate: null,
                    userId: auth.currentUser.uid,
                    resume: data.resume,
                    currentTrip: true
                }
                await createTrip(tripToCreate);
                router.replace('/(tabs)');
            }
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
                required: 'Titre de la WayStory requis',
                }}
                render={({ field: { onChange, value } }) => (
                <Input
                    placeholder="Titre de la WayStory"
                    keyboardType="default"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.name?.message}
                />
                )}
            />
            <Controller 
                control={control}
                name="resume"
                render={({ field: { onChange, value } }) => (
                <Input
                    placeholder="(facultatif) Résumé de la WayStory"
                    keyboardType="default"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.name?.message}
                />
                )}
            />

            <Button
                title="Valider"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                containerStyle={styles.buttonContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      padding: 10,
      width: '100%',
    },
    buttonContainer: {
      marginTop: 20,
    }
  });