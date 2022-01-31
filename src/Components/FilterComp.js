//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { height, moderateScale, moderateScaleVertical, width } from '../styles/responsiveSize';
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
    allClearFilters = () => { },
    selectedSortFilter,
    onSelectedSortFilter,
    minimumPrice = 0,
    maximumPrice = 50000,
    updateMinMax
}) => {

    const [state, setState] = useState({
        minPrice: 0,
        maxPrice: 50000
    })
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const onDone = () => {
        let filterData = {
            selectedSorting: selectedSortFilter?.labelValue || 0,
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

    //price range slider functions
    const _priceChangeHandler = (val) => {
        updateMinMax(val[0], val[1])
    };

    const sortingView = (val, i) => {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.sortingView}
                onPress={() => onSelectedSortFilter(val)}
            >
                <Text style={{
                    fontSize: moderateScale(14),
                    fontFamily: fontFamily.medium
                }}>{val.label}</Text>
                <Image
                    source={selectedSortFilter?.id == val?.id ? imagePath.radioActive : imagePath.radioInActive}
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
                        <View style={{
                            ...styles.horizontalLine,
                            borderBottomColor: isDarkMode
                                ? colors.whiteOpacity22
                                : colors.lightGreyBg,
                        }} />
                        <Text style={{
                            fontSize: moderateScale(16),
                            fontFamily: fontFamily.bold
                        }}>Price Range</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: moderateScaleVertical(8) }}>
                            <Text style={{
                                fontSize: moderateScale(14),
                                fontFamily: fontFamily.medium
                            }}>{minimumPrice}</Text>
                            <Text style={{
                                fontSize: moderateScale(14),
                                fontFamily: fontFamily.medium
                            }}>{maximumPrice}</Text>
                        </View>
                        <View style={{ marginHorizontal: moderateScale(12) }}>
                            <MultiSlider
                                values={[minimumPrice, maximumPrice]}
                                sliderLength={width / 1.2}
                                onValuesChange={_priceChangeHandler}
                                containerStyle={{ height: moderateScale(30) }}
                                min={0}
                                max={50000}
                                step={1}
                                allowOverlap={false}
                                selectedStyle={{
                                    ...styles.selectedStyle,
                                    backgroundColor: themeColors.primary_color,
                                }}
                                // Style={{height:40}}
                                customMarker={() => <View style={{
                                    ...styles.customMarker,
                                    backgroundColor: themeColors.primary_color,
                                }}
                                />
                                }
                            />
                        </View>
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
    selectedStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 3,
    },
    customMarker: {
        alignItems: 'center',
        height: 15,
        width: 15,
        borderRadius: 15 / 2,
    },
});

//make this component available to the app
export default FilterComp;
