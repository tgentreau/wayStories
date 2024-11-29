import {createTrip} from '@/services/tripService';
import {Button, Input} from '@rneui/themed';
import {Router, useRouter} from 'expo-router';
import {Auth, getAuth} from 'firebase/auth';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import dayjs from "dayjs";
import { CreateTripData, CreateTripForm } from '@/types/trip';

export default function CreateWayStoryForm() {
    const {control, handleSubmit, formState: {errors}} = useForm<CreateTripForm>();
    const [loading, setLoading] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string>();
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const date: Date = new Date();
    const router: Router = useRouter();

    const onSubmit = async (data: CreateTripForm): Promise<void> => {
        try {
            setLoading(true);
            const auth: Auth = getAuth();
            const date: string = dayjs(new Date()).format('DD/MM/YYYY')
            setStartDate(date);
            if (auth.currentUser) {
                const tripToCreate: CreateTripData = {
                    name: data.name,
                    startDate: startDate ?? date,
                    userId: auth.currentUser.uid,
                    resume: data.resume,
                    currentTrip: true,
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

    const onChangeStartDate = (event: DateTimePickerEvent, selectedDate: Date | undefined): void => {
        setShowDatePicker(false);
        if (selectedDate) {
            setStartDate(dayjs(selectedDate).format('DD/MM/YYYY'));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.dateContainer}>
                {
                    Platform.OS === 'ios' && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            onChange={onChangeStartDate}
                        />
                    )
                }
                {
                    Platform.OS === 'android' && (
                        <>
                            <Text style={styles.textDate}>
                                Date de début
                            </Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                <Text style={styles.dateText}>{startDate ?? 'Sélectionner une date'}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode="date"
                                    onChange={onChangeStartDate}
                                />
                            )}
                        </>
                    )
                }
            </View>
            <Controller
                control={control}
                name="name"
                rules={{
                    required: 'Le titre est requis',
                }}
                render={({field: {onChange, value}}) => (
                    <Input
                        placeholder="Titre*"
                        keyboardType="default"
                        autoCapitalize="none"
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            <Controller
                control={control}
                name="resume"
                render={({field: {onChange, value}}) => (
                    <Input
                        placeholder="Résumé"
                        keyboardType="default"
                        autoCapitalize="none"
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            <Button
                title="Valider"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
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
    },
    dateContainer: {
        marginBottom: 20,
    },
    textDate: {
        marginStart: 10,
        fontSize: 20,
        fontWeight: '300',
    },
    dateText: {
        fontSize: 18,
        color: 'blue',
        marginStart: 10,
    },
});