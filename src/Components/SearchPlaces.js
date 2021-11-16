import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity,Image } from 'react-native';
import imagePath from '../constants/imagePath';
import { googlePlacesApi } from '../utils/googlePlaceApi';

const SearchPlaces = ({
    containerStyle = {},
    inputStyle = {},
    mapKey = "",
    fetchArrayResult = () => { },
    value = '',
    setValue = () => { },
    placeHolder,
}) => {
    console.log(mapKey, 'in MapPlaceComp map key')

    const textChangeHandler = async (data) => {
        setValue(data)
        let res = await googlePlacesApi(data, mapKey);
        if (res && res.predictions) {
            fetchArrayResult(res.predictions)
        }
    }
    return (
        <View style={{ ...styles.container, ...containerStyle }}>
            <View style={{ ...styles.subCont, ...inputStyle }}>
                <View style={{  flexDirection: 'row' }}>
                    <TextInput
                        value={value}
                        placeholder={placeHolder}
                        onChangeText={textChangeHandler}
                        style={styles.text}
                    />
                    <TouchableOpacity onPress={() => _moveToNextScreen('pickup')}>
                        <Image
                            style={{
                                height: 25,
                                width: 25,
                            }}
                            source={imagePath.blackNav}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',

    },
    subCont: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderBottomWidth: 0.2,
        borderColor: 'black',
        backgroundColor: 'white',
        height: 48,
        // marginBottom: 10
    },
    text: {
        width: '100%',
        paddingHorizontal: 8
    },
    dropDown: {
        position: 'relative',
        marginTop: 6,
        width: '100%',
    },
    placeCont: {
        borderBottomWidth: 0.5,
        paddingVertical: 2,

    },
    placeText: {
        padding: 10,
        fontSize: 12,
        color: 'black',
        opacity: 0.8
    }
})

export default SearchPlaces;