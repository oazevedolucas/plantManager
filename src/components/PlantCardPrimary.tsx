import React from 'react';
import { 
    StyleSheet, 
    Text    
} from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import { SvgFromUri } from 'react-native-svg';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface PlantProps extends RectButtonProps {
    dataToList: {
        name: string;
        photo: string;
    }
}

interface PlantPropsToSave extends RectButtonProps {
    active?: boolean;
    dataToSave: {
        key: string;
        value: string;
    }
}

export const PlantCardPrimary = ({  dataToList, ...rest} : PlantProps) => {
    return(
        <RectButton
            style={styles.container}
            {...rest}
        >
            <SvgFromUri 
                uri={dataToList.photo}
                width={70} 
            height={70} 
            />
            <Text style={styles.text}>
                { dataToList.name }
            </Text>
        </RectButton>
    )
}

export const PlantCardPrimarySave = ({ active = false, dataToSave, ...rest} : PlantPropsToSave) => {
    return(
        <RectButton
            style={[
                styles.container,
                active && styles.containerActive
            ]}
            {...rest}
        >
            <SvgFromUri
                uri={dataToSave.key}
                width={70}
            height={70}
            />
        </RectButton>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: '45%',
        backgroundColor: colors.shape,
        borderRadius: 20,
        paddingVertical: 10,
        alignItems: 'center',
        margin: 10
    },
    text: {
        color: colors.green_dark,
        fontFamily: fonts.heading,
        marginVertical: 16
    },
    containerActive: {
        backgroundColor: colors.green_light
    },
})