import React, {useState} from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Platform,
    TouchableOpacity
} from 'react-native';
import {SvgFromUri} from 'react-native-svg';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {useNavigation, useRoute} from '@react-navigation/core';
import DateTimePicker, {Event} from '@react-native-community/datetimepicker';
import {format, isBefore} from 'date-fns';
import {PlantProps, removePlant, savePlant} from '../libs/storage';

import {Button} from '../components/Button';

import waterdrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import api from "../services/api";

interface Params {
    plant: PlantProps
}

export function PlantSave() {
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const route = useRoute();
    const {plant} = route.params as Params;

    const navigation = useNavigation();

    function handleChangeTime(event: Event, dateTime: Date | undefined) {
        if (Platform.OS === 'android') {
            setShowDatePicker(oldState => !oldState);
        }

        if (dateTime && isBefore(dateTime, new Date())) {
            setSelectedDateTime(new Date());
            return Alert.alert('Escolha uma hora no futuro! ⏰');
        }

        if (dateTime)
            setSelectedDateTime(dateTime);
    }

    function handleOpenDatetimePickerForAndroid() {
        setShowDatePicker(oldState => !oldState);
    }

    const onChange = (event: any, value: any) => {

        setSelectedDateTime(value);
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
    };

    const showPicker = () => {
        setShowDatePicker(true);
    };

    async function handleSave() {
        try {
            await savePlant({
                ...plant,
                dateTimeNotification: selectedDateTime
            });
            navigation.navigate('Confirmation', {
                title: 'Tudo certo',
                subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.',
                buttonTitle: 'Continuar ☘️',
                icon: 'watter',
                nextScreen: 'MyPlants',
            });

        } catch {
            Alert.alert('Não foi possível salvar. 😢');
        }
    }

    async function handleDelete() {
        Alert.alert('🗑️\nRemover', `Deseja excluir sua planta cadastrada ${plant.name}?`,[
            {
                text: 'Não 🤚🏽',
                style: 'cancel'
            },
            {
                text: 'Sim 👍🏽',
                onPress: async () => {
                    try {
                        await api.delete(`plants/${plant.id}`)
                        navigation.navigate('Confirmation', {
                            title: 'Tudo certo',
                            subtitle: 'A plantinha foi removida da sua lista com sucesso.',
                            buttonTitle: 'Continuar ☘️',
                            icon: 'shuap',
                            nextScreen: 'PlantSelect',
                        });
                        await removePlant(plant.id);
                    } catch {
                        Alert.alert('Não foi possível salvar. 😢');
                    }
                }
            }
        ]);
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollListContainer}
        >
            <View style={styles.container}>
                <Button
                    disabled={plant.default.includes("true", 0)}
                    style={[styles.btnContainer,
                        plant.default.includes("true", 0) && styles.btnContainerDisabled]
                }
                    title="X"
                    onPress={handleDelete}
                />
                <View style={styles.plantInfo}>

                    <SvgFromUri
                        uri={plant.photo}
                        height={150}
                        width={150}
                    />
                    <Text style={styles.plantName}>
                        {plant.name}
                    </Text>
                    <Text style={styles.plantAbout}>
                        {plant.about}
                    </Text>
                </View>

                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <Image
                            source={waterdrop}
                            style={styles.tipImage}
                        />
                        <Text style={styles.tipText}>
                            {plant.water_tips}
                        </Text>
                    </View>

                    <Text style={styles.alertLabel}>
                        Escolha o melhor horário para ser lembrado:
                    </Text>

                    <View style={styles.pickedDateContainer}>
                        <DateTimePicker
                            value={selectedDateTime}
                            mode={'time'}
                            display='spinner'
                            is24Hour={true}
                            onChange={onChange}
                        />
                    </View>

                    <Button
                        style={styles.btnCadastrar}
                        title="Cadastrar planta"
                        onPress={handleSave}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape,
    },
    scrollListContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape
    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: getBottomSpace() || 20
    },
    plantName: {
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15,
    },
    plantAbout: {
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10
    },
    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60
    },
    tipImage: {
        width: 56,
        height: 56,
    },
    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'justify'
    },
    alertLabel: {
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5
    },
    dateTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
    },
    dateTimePickerText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    },
    pickedDateContainer: {
        padding: 20,
        backgroundColor: '#eee',
        borderRadius: 10,
    },
    pickedDate: {
        color: '#fff',
        textAlign: 'center'
    },
    dateText: {
        color: '#fff'
    },
    btnContainer: {
        width: 50,
        height: 50,
        marginTop: 50,
        backgroundColor: colors.red,
        marginLeft: '80%',
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
    },
    btnContainerDisabled: {
        backgroundColor: colors.gray,
    },
    btnCadastrar: {
        marginTop: 20,
        width: '80%',
        height: 50,
        backgroundColor: colors.green,
        alignItems: 'center',
        alignSelf: 'center',
        paddingTop: 12,
        borderRadius: 20,
    },
    datePicker: {
        width: 320,
        height: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    }
});