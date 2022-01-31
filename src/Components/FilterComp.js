//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

import { height, moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import Modal from 'react-native-modal';
import strings from '../constants/lang';
import fontFamily from '../styles/fontFamily';
import colors from '../styles/colors';
import imagePath from '../constants/imagePath';
import ButtonComponent from './ButtonComponent';
import ButtonWithLoader from './ButtonWithLoader';
import GradientButton from './GradientButton';

let sortingData = [
    {
        id: 1,
        label: strings.RATING,
        labelValue: 'rating',
        parent: strings.SORT_BY,
    },
    {
        id: 2,
        label: strings.LOW_TO_HIGH,
        labelValue: 'low_to_high',
        parent: strings.SORT_BY,
    },
    {
        id: 3,
        label: strings.HIGH_TO_LOW,
        labelValue: 'high_to_low',
        parent: strings.SORT_BY,
    },
    {
        id: 4,
        label: strings.POPULARITY,
        labelValue: 'a_to_z',
        parent: strings.SORT_BY,
    },
    {
        id: 5,
        label: strings.MOST_PURCHASED,
        labelValue: 'z_to_a',
        parent: strings.SORT_BY,
    }
]

const FilterComp = ({
    sortFilters = sortingData,
    isDarkMode = null,
    themeColors,
    onFilterApply = () => { },
    onShowHideFilter = () => { },
    allClearFilters = () => {}
}) => {

    const [state, setState] = useState({
        selectedSorting: null,
        minPrice: 0,
        maxPrice: 50000
    })
    const { selectedSorting } = state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const onDone = () => {
        let filterData  = {
            selectedSorting: selectedSorting.labelValue,
            selectedVariants: [],
            selectedOptions: [],
            sleectdBrands: []
        }
        onFilterApply(filterData)
        onShowHideFilter()
    }

    const onClearFilter = () => {
        updateState({ selectedSorting: null })
        onShowHideFilter()
        allClearFilters()
    }

    const sortingView = (val, i) => {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.sortingView}
                onPress={() => updateState({ selectedSorting: val })}
            >
                <Text style={{
                    fontSize: moderateScale(14),
                    fontFamily: fontFamily.medium
                }}>{val.label}</Text>
                <Image
                    source={selectedSorting?.id == val?.id ? imagePath.radioActive : imagePath.radioInActive}
                />
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <Modal
                onBackdropPress={onShowHideFilter}
                isVisible
                style={{
                    margin: 0,
                    justifyContent: 'flex-end',
                    height: height / 2
                }}
            >
                <View style={{
                    backgroundColor: 'white',
                    height: height / 2,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    padding: 16
                    // flex:1
                }}>
                    <ScrollView>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{
                                fontSize: moderateScale(16),
                                fontFamily: fontFamily.bold
                            }}>Sort By</Text>

                            <TouchableOpacity
                                onPress={onClearFilter}
                            >
                                <Text style={{
                                    fontSize: moderateScale(14),
                                    fontFamily: fontFamily.bold,
                                    color: colors.redB
                                }}>Clear Filter</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            ...styles.horizontalLine,
                            borderBottomColor: isDarkMode
                                ? colors.whiteOpacity22
                                : colors.lightGreyBg,
                        }} />
                        {sortFilters.map((val, i) => {
                            return sortingView(val, i)
                        })}
                    </ScrollView>
                    <GradientButton
                        colorsArray={[
                            themeColors.primary_color,
                            themeColors.primary_color,
                        ]}
                        // textStyle={styles.textStyle}
                        onPress={onDone}
                        marginTop={moderateScaleVertical(10)}
                        marginBottom={moderateScaleVertical(30)}
                        btnText={strings.DONE}
                    />
                </View>
            </Modal>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sortingView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScaleVertical(12)
    },
    horizontalLine: {
        width: '100%',
        borderBottomWidth: 0.5,
        marginVertical: moderateScaleVertical(8)
    },
});

//make this component available to the app
export default FilterComp;
