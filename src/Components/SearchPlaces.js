import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getPlaceDetails, googlePlacesApi } from '../utils/googlePlaceApi';

const SearchPlaces = ({
    placeData,
    previousLocation,
    containerStyle = {},
    inputStyle = {},
    position = 'relative',
    icon,
    dropDownStyle = {},
    resultTextStyle = {},
    address = '',
    mapKey="",
    fetchArrayResult = () => {}
}) => {



    console.log(mapKey, 'in MapPlaceComp map key')

    const [placesData, setPlacesData] = useState([]);
    const [value, setValue] = useState(address);

    /****************** Google Api Places
     */const textChangeHandler = async (data) => {
       
        setValue(data)
        let res = await googlePlacesApi(data, mapKey);
        if (res && res.predictions) {
            setPlacesData(res.predictions)
            fetchArrayResult(res.predictions)
        }
    }
/****************** Render Google Api Places
     */ const renderPlaces = () => {
        if (placesData && placesData.length > 0) {
            return placesData.map(x => <TouchableOpacity onPress={() => placePress(x)} style={styles.placeCont} key={x.place_id}>
                <Text style={{
                    ...styles.placeText,
                    ...resultTextStyle,
                }}>{x.description}</Text>
            </TouchableOpacity>)
        } else {
            return null
        }
    }

    const placePress = async (place) => {
        console.log('placess')
        setValue(place.description);
        setPlacesData([]);
        if (place.place_id) {
            let res = await getPlaceDetails(place.place_id, mapKey);
            // setValue(res.result.name);
            placeData(res)
        } else {
            alert('Place Id not found')
        }
    }
    return (
        <View style={{ ...styles.container, ...containerStyle }}>
            <View style={{
                ...styles.subCont,
                ...inputStyle,
            }}>
                <View style={{ flex: 1 }}>
                    <TextInput
                        value={value}
                        placeholder={'Search address'}
                        onChangeText={textChangeHandler}
                        style={styles.text}
                    />
                </View>
                {/* <TouchableOpacity
                    style={{ flex: 0.1 }}
                    activeOpacity={0.8}
                    style={{ backgroundColor: 'red' }}
                >
                    <Image source={imagePath.icd} />
                </TouchableOpacity> */}
            </View>
            <View style={{ width: '100%' }}>
                <View style={{
                    ...styles.dropDown,
                    ...dropDownStyle,
                    position: position
                }}>
                    {renderPlaces()}
                </View>
            </View>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'

    },
    subCont: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: 'black',
        backgroundColor: 'white',
        height: 48
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