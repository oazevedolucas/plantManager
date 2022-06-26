import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
    Alert, FlatList, ScrollView, ActivityIndicator
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {PlantProps} from '../libs/storage';


import {Button} from '../components/Button';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import api from "../services/api";
import {EnviromentButton} from "../components/EnviromentButton";
import {PlantCardPrimary, PlantCardPrimarySave} from "../components/PlantCardPrimary";
import {Load} from "../components/Load";


interface SelectProps {
    key: string;
    value: string;
}


export function NewPlant() {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [name, setName] = useState<string>();
    const [about, setAbout] = useState<string>();
    const [waterTips, setWaterTips] = useState<string>();
    const [photoSelected, setPhotoSelected] = useState('');
    const [enviroments, setEnviroments] = useState<string[]>();
    const [enviromentsToSelect, setEviromentsToSelect] = useState<SelectProps[]>([]);
    const [repeatToSelect, setRepeatToSelect] = useState<SelectProps[]>([]);
    const [typesToSelect, setTypesToSelect] = useState<SelectProps[]>([]);
    const [photoToSelect, setPhotoToSelect] = useState<SelectProps[]>([]);
    const [type, setType] = useState<string[]>();
    const [times, setTimes] = useState<string>();
    const [enviromentSelected, setEnviromentSelected] = useState('');
    const [typeSelected, setTypeSelected] = useState('');
    const [repeatSelected, setRepeatSelected] = useState('');
    const [plantToSave, setPlantToSave] = useState<PlantProps>();

    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {


        setEviromentsToSelect([
            {
                key: 'living_room',
                value: 'Sala',
            },
            {
                key: 'bedroom',
                value: 'Quarto',
            }, {
                key: 'kitchen',
                value: 'Cozinha',
            }, {
                key: 'bathroom',
                value: 'Banheiro',
            },
        ]);

        setTypesToSelect([
            {
                key: 'big',
                value: 'Grandes',
            },
            {
                key: 'middle',
                value: 'Médias',
            }, {
                key: 'small',
                value: 'Pequenas',
            }
        ]);

        setRepeatToSelect([
            {
                key: 'day',
                value: 'Todo dia',
            },
            {
                key: 'week',
                value: 'Toda semana',
            }
        ]);

        setPhotoToSelect([
            {
                key: 'https://storage.googleapis.com/golden-wind/nextlevelweek/05-plantmanager/1.svg',
                value: 'Aningapara',
            },

            {
                key: 'https://storage.googleapis.com/golden-wind/nextlevelweek/05-plantmanager/2.svg',
                value: 'Zamioculca',
            },
            {
                key: 'https://storage.googleapis.com/golden-wind/nextlevelweek/05-plantmanager/3.svg',
                value: 'Peperomia',
            },
            {
                key: 'https://storage.googleapis.com/golden-wind/nextlevelweek/05-plantmanager/4.svg',
                value: 'Imbé',
            },
            {
                key: 'https://storage.googleapis.com/golden-wind/nextlevelweek/05-plantmanager/5.svg',
                value: 'Espada de São Jorge',
            },
            {
                key: 'https://storage.googleapis.com/golden-wind/nextlevelweek/05-plantmanager/6.svg',
                value: 'Yucca',
            },
            {
                key: 'https://storage.googleapis.com/golden-wind/nextlevelweek/05-plantmanager/7.svg',
                value: 'Frutíferas',
            },
            {
                key: 'https://storage.googleapis.com/golden-wind/nextlevelweek/05-plantmanager/8.svg',
                value: 'Orquídea',
            },
        ])

    }, [])

    function handleInputBlur() {
        setIsFocused(false);
        setIsFilled(!!name);
    }

    function handleInputFocus() {
        setIsFocused(true)
    }

    function handleInputChangeName(value: string) {
        setIsFilled(!!value);
        setName(value);
    }

    function handleInputChangeAbout(value: string) {
        setIsFilled(!!value);
        setAbout(value);
    }

    function handleInputChangeWaterTips(value: string) {
        setIsFilled(!!value);
        setWaterTips(value);
    }

    function handleInputChangePhoto(value: string) {
        setIsFilled(!!value);
        setPhotoSelected(value);
    }

    function handleInputChangeTimes(value: string) {
        setIsFilled(!!value);
        setTimes(value);
    }

    function handleTypesSelected(types: string) {
        setTypeSelected(types);
    }

    function handleRepeatSelected(repeat: string) {
        setRepeatSelected(repeat);
    }

    function handleEnviromentSelected(enviroments: string) {
        setEnviromentSelected(enviroments);
    }

    function handlePhotoSelected(photo: string) {
        setPhotoSelected(photo);
    }

    async function handleSubmit() {
        if (!name || !about)
            return Alert.alert('Preciso de mais informações 🤚🏽');

        if (!photoSelected)
            return Alert.alert('Insira uma foto da sua platinha. 📸');

        if (!waterTips)
            return Alert.alert('É necessário inserir dicas da sua platinha. 💧');

        try {
            await api
                .post(`plants`, {
                    name: name,
                    default: ['false'],
                    about: about,
                    water_tips: waterTips,
                    photo: photoSelected,
                    type: [ typeSelected ],
                    environments: [ enviromentSelected ],
                    frequency: {
                        times: times,
                        repeat_every: repeatSelected
                    }
                });
            navigation.navigate('Confirmation', {
                title: 'Ebaa',
                subtitle: 'Sua nova plantinha foi adicionada a nossa lista.',
                buttonTitle: 'Muito Obrigado 🥰',
                icon: 'plant',
                nextScreen: 'PlantSelect',
            });

        } catch {
            Alert.alert('Não foi possível cadastrar sua plantina 🌱');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollListContainer}
                    >
                        <View style={styles.content}>
                            <View style={styles.form}>
                                <View style={styles.header}>
                                    <Text style={styles.emoji}>
                                        {isFilled ? '🪴' : '🌱'}
                                    </Text>
                                    <Text style={styles.title}>
                                        Cadastre uma nova {'\n'}
                                        platinha
                                    </Text>
                                </View>
                                <TextInput
                                    style={[
                                        styles.input,
                                        (isFocused || isFilled) &&
                                        {borderColor: colors.green}
                                    ]}
                                    placeholder="Nome"
                                    onBlur={handleInputBlur}
                                    onFocus={handleInputFocus}
                                    onChangeText={handleInputChangeName}
                                />
                                <TextInput
                                    style={[
                                        styles.input,
                                        (isFocused || isFilled) &&
                                        {borderColor: colors.green}
                                    ]}
                                    placeholder="Descrição"
                                    onFocus={handleInputFocus}
                                    onChangeText={handleInputChangeAbout}
                                />
                                <TextInput
                                    style={[
                                        styles.input,
                                        (isFocused || isFilled) &&
                                        {borderColor: colors.green}
                                    ]}
                                    placeholder="Dicas"
                                    onFocus={handleInputFocus}
                                    onChangeText={handleInputChangeWaterTips}
                                />

                                <TextInput
                                    style={[
                                        styles.input,
                                        (isFocused || isFilled) &&
                                        {borderColor: colors.green}
                                    ]}
                                    maxLength={1}
                                    keyboardType={"numeric"}
                                    placeholder="Vezes"
                                    onFocus={handleInputFocus}
                                    onChangeText={handleInputChangeTimes}
                                />

                                <Text style={styles.PlaceHolderBottom}>
                                    Repetir
                                </Text>
                                <FlatList
                                    data={repeatToSelect}
                                    keyExtractor={(item) => String(item.key)}
                                    renderItem={({item}) => (
                                        <EnviromentButton
                                            title={item.value}
                                            active={item.key === repeatSelected}
                                            onPress={() => handleRepeatSelected(item.key)}
                                        />
                                    )}
                                    horizontal
                                    contentContainerStyle={styles.enviromentList}
                                />


                                <Text style={styles.PlaceHolderBottom}>
                                    Tamanho
                                </Text>
                                <FlatList
                                    data={typesToSelect}
                                    keyExtractor={(item) => String(item.key)}
                                    renderItem={({item}) => (
                                        <EnviromentButton
                                            title={item.value}
                                            active={item.key === typeSelected}
                                            onPress={() => handleTypesSelected(item.key)}
                                        />
                                    )}
                                    horizontal
                                    contentContainerStyle={styles.enviromentList}
                                />
                                <Text style={styles.PlaceHolderBottom}>
                                    Ambiente
                                </Text>

                                <FlatList
                                    data={enviromentsToSelect}
                                    keyExtractor={(item) => String(item.key)}
                                    renderItem={({item}) => (
                                        <EnviromentButton
                                            title={item.value}
                                            active={item.key === enviromentSelected}
                                            onPress={() => handleEnviromentSelected(item.key)}
                                        />
                                    )}
                                    horizontal
                                    contentContainerStyle={styles.enviromentList}
                                />

                                <Text style={styles.PlaceHolderBottom}>
                                    Modelo
                                </Text>

                                <FlatList
                                    data={photoToSelect}
                                    keyExtractor={(item) => String(item.key)}
                                    renderItem={({item}) => (
                                        <PlantCardPrimarySave
                                            active={item.key == photoSelected}
                                            dataToSave={item}
                                            onPress={() => handlePhotoSelected(item.key)}
                                        />
                                    )}
                                    showsVerticalScrollIndicator={false}
                                    horizontal
                                />

                                <View style={styles.footer}>
                                    <Button
                                        title="Cadastrar"
                                        onPress={handleSubmit}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    scrollListContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        width: '100%',
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center'
    },
    emoji: {
        fontSize: 44
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.gray,
        color: colors.heading,
        width: '80%',
        fontSize: 18,
        marginTop: 35,
        padding: 10,
        textAlign: 'center'
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 20
    },
    PlaceHolderBottom: {
        fontSize: 20,
        lineHeight: 30,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.text,
        marginTop: 15
    },
    footer: {
        width: '100%',
        marginTop: 40,
        paddingHorizontal: 20
    },
    containerSelect: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    enviromentList: {
        justifyContent: 'center',
        marginVertical: 8
    },
});