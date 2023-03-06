//import liraries
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import BannerLoader from '../../../Components/Loaders/BannerLoader';
import CategoryLoader2 from '../../../Components/Loaders/CategoryLoader2';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import { moderateScale, moderateScaleVertical } from '../../../styles/responsiveSize';

// create a component
const DashBoardFiveV2ApiLoader = () => {
    return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}>
                <CategoryLoader2 />
                <View style={{ flexDirection: 'row', marginTop: moderateScaleVertical(0) }}>
                    <HeaderLoader
                        viewStyles={{
                            marginTop: moderateScaleVertical(8),
                            marginBottom: moderateScaleVertical(0),
                        }}
                        widthLeft={moderateScale(150)}
                        rectWidthLeft={moderateScale(150)}
                        heightLeft={moderateScaleVertical(240)}
                        rectHeightLeft={moderateScaleVertical(240)}
                        isRight={false}
                        rx={15}
                        ry={15}
                    />
                    <HeaderLoader
                        viewStyles={{
                            marginTop: moderateScaleVertical(8),
                            marginBottom: moderateScaleVertical(0),
                        }}
                        widthLeft={moderateScale(150)}
                        rectWidthLeft={moderateScale(150)}
                        heightLeft={moderateScaleVertical(240)}
                        rectHeightLeft={moderateScaleVertical(240)}
                        isRight={false}
                        rx={15}
                        ry={15}
                    />
                    <HeaderLoader
                        viewStyles={{
                            marginTop: moderateScaleVertical(8),
                            marginBottom: moderateScaleVertical(0),
                        }}
                        widthLeft={moderateScale(150)}
                        rectWidthLeft={moderateScale(150)}
                        heightLeft={moderateScaleVertical(240)}
                        rectHeightLeft={moderateScaleVertical(240)}
                        isRight={false}
                        rx={15}
                        ry={15}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <HeaderLoader
                        widthLeft={moderateScale(180)}
                        rectWidthLeft={moderateScale(180)}
                        rectHeightLeft={moderateScaleVertical(60)}
                        isRight={false}
                        rx={4}
                        ry={4}
                    />
                    <HeaderLoader
                        widthLeft={moderateScale(100)}
                        rectWidthLeft={moderateScale(100)}
                        rectHeightLeft={moderateScaleVertical(60)}
                        isRight={false}
                        rx={4}
                        ry={4}
                    />
                </View>

                <BannerLoader
                    // isVendorLoader
                    viewStyles={{ marginTop: moderateScale(12) }}
                />
                <BannerLoader
                    // isVendorLoader
                    viewStyles={{ marginTop: moderateScale(12) }}
                />
                <BannerLoader
                    // isVendorLoader
                    viewStyles={{ marginTop: moderateScale(12) }}
                />
            </ScrollView>
    );
};

export default DashBoardFiveV2ApiLoader;
