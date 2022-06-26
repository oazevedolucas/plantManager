import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native';
import {EnviromentButton} from '../components/EnviromentButton';
import {useNavigation} from '@react-navigation/core';

import {Header} from '../components/Header';
import {PlantCardPrimary} from '../components/PlantCardPrimary';
import {Load} from '../components/Load';
import {PlantProps} from '../libs/storage';

import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface EnviromentProps {
    key: string;
    title: string;
}

export function PlantSelect() {
    const [enviroments, setEnvirtoments] = useState<EnviromentProps[]>([]);
    const [types, setTypes] = useState<EnviromentProps[]>([]);
    const [defaults, setDefaults] = useState<EnviromentProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    const [enviromentSelected, setEnviromentSelected] = useState('all');
    const [defaultSelected, setDefaultSelected] = useState('all');
    const [typeSelected, setTypeSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);

    const navigation = useNavigation();

    function handleEnrivomentSelected(environment: string) {
        setEnviromentSelected(environment);
        let filtered = plants;

        if (defaultSelected != 'all') {
            filtered = filtered.filter(plant =>
                plant.default.includes(defaultSelected)
            );
        }

        if (typeSelected != 'all') {
            filtered = filtered.filter(plant =>
                plant.type.includes(typeSelected)
            );
        }

        if (environment == 'all')
            return setFilteredPlants(filtered);

        filtered = filtered.filter(plant =>
            plant.environments.includes(environment)
        );

        setFilteredPlants(filtered);
    }

    function handleTypesSelected(types: string) {
        setTypeSelected(types);
        let filtered = plants;

        if (defaultSelected != 'all') {
            filtered = filtered.filter(plant =>
                plant.default.includes(defaultSelected)
            );
        }

        if (enviromentSelected != 'all') {
            filtered = filtered.filter(plant =>
                plant.environments.includes(enviromentSelected)
            );
        }

        if (types == 'all')
            return setFilteredPlants(filtered);

        filtered = filtered.filter(plant =>
            plant.type.includes(types)
        );

        setFilteredPlants(filtered);
    }

    function handleDefaultsSelected(defaults: any) {
        setDefaultSelected(defaults);
        let filtered = plants;

        if (typeSelected != 'all') {
            filtered = filtered.filter(plant =>
                plant.type.includes(typeSelected)
            );
        }
        if (enviromentSelected != 'all') {
            filtered = filtered.filter(plant =>
                plant.environments.includes(enviromentSelected)
            );
        }

        if (defaults == 'all')
            return setFilteredPlants(filtered);

        filtered = filtered.filter(plant =>
            plant.default.includes(defaults)
        );

        setFilteredPlants(filtered);
    }

    async function fetchEnviroment() {
        const {data} = await api
            .get('plants_environments');
        setEnvirtoments([
            {
                key: 'all',
                title: 'Todos',
            },
            ...data
        ]);
    }

    async function fetchType() {
        const {data} = await api
            .get('plants_types');
        setTypes([
            {
                key: 'all',
                title: 'Todos',
            },
            ...data
        ])
    }

    async function fetchPlants() {
        fetchType();
        fetchEnviroment();

        const {data} = await api
            .get(`plants?_sort=name&_order=asc`);

        if (!data)
            return setLoading(true);

        setPlants(data);
        setFilteredPlants(data);
        setLoading(false);
    }

    function handleFetchMore(distance: number) {
        if (distance < 1)
            return;

        setPage(oldValue => oldValue + 1);
        fetchPlants();
    }

    function handlePlantSelect(plant: PlantProps) {
        navigation.navigate('PlantSave', {plant});
    }

    function handleCreate() {
        navigation.navigate('NewPlant');
    }


    useEffect(() => {

        setDefaults([
            {
                key: 'all',
                title: 'Todos',
            },
            {
                key: 'false',
                title: 'Criadas',
            },
            {
                key: 'true',
                title: 'Padrões',
            }
        ])

        fetchPlants();
    }, [])

    if (loading)
        return <Load/>

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header/>
            </View>

            <View style={styles.header}>
                <Text style={styles.title}>
                    Escolha o tamanho
                </Text>
            </View>

            <View>
                <FlatList
                    data={types}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({item}) => (
                        <EnviromentButton
                            title={item.title}
                            active={item.key === typeSelected}
                            onPress={() => handleTypesSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

            <View style={styles.header}>
                <Text style={styles.title}>
                    Escolha o ambiente
                </Text>
            </View>
            <View>
                <FlatList
                    data={enviroments}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({item}) => (
                        <EnviromentButton
                            title={item.title}
                            active={item.key === enviromentSelected}
                            onPress={() => handleEnrivomentSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

            <View>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Filtre as padrões ou criadas
                    </Text>
                </View>

                <FlatList
                    data={defaults}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({item}) => (
                        <EnviromentButton
                            title={item.title}
                            active={item.key === defaultSelected}
                            onPress={() => handleDefaultsSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
                <EnviromentButton
                    style={styles.buttonCreate}
                    title='Adicionar'
                    active={true}
                    onPress={() => handleCreate()}
                />
            </View>

            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({item}) => (
                        <PlantCardPrimary
                            dataToList={item}
                            onPress={() => handlePlantSelect(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                />

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 30,
        marginTop: 20
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading,
    },
    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 1,
        marginLeft: 20,
        marginVertical: 5,
        paddingRight: 32
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    },
    buttonCreate: {
        marginLeft: 35,
        width: '20%'
    }
});