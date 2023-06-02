//import liraries
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import BannerLoader from '../../../Components/Loaders/BannerLoader';
import ProductLoader from '../../../Components/Loaders/ProductLoader';
import WrapperContainer from '../../../Components/WrapperContainer';
import { moderateScale, moderateScaleVertical } from '../../../styles/responsiveSize';
import ContentLoader from 'react-native-easy-content-loader';
import { View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../../styles/theme';
import colors from '../../../styles/colors';
import { useSelector } from 'react-redux';

// create a component

var cardHeight = moderateScale(60)
var cardWidth = moderateScale(60)

let itemHeight = parseInt(moderateScale(170))
let itemWidth = parseInt(moderateScale(140))


const DashBoardFiveV2ApiLoader = () => {
    const { themeToggle, themeColor } = useSelector(
        state => state?.initBoot,
    );

    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

    return (
        <WrapperContainer bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}>

                <BannerLoader homeLoaderHeight={moderateScaleVertical(180)} viewStyles={{ marginVertical: moderateScale(16) }} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <BannerLoader
                        homeLoaderHeight={cardHeight}
                        homeLoaderWidth={cardWidth}
                    />
                    <BannerLoader
                        homeLoaderHeight={cardHeight}
                        homeLoaderWidth={cardWidth}
                    />

                    <BannerLoader
                        homeLoaderHeight={cardHeight}
                        homeLoaderWidth={cardWidth}
                    />

                    <BannerLoader
                        homeLoaderHeight={cardHeight}
                        homeLoaderWidth={cardWidth}
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: moderateScaleVertical(16) }}>
                    <BannerLoader
                        homeLoaderHeight={cardHeight}
                        homeLoaderWidth={cardWidth}
                    />
                    <BannerLoader
                        homeLoaderHeight={cardHeight}
                        homeLoaderWidth={cardWidth}
                    />

                    <BannerLoader
                        homeLoaderHeight={cardHeight}
                        homeLoaderWidth={cardWidth}
                    />

                    <BannerLoader
                        homeLoaderHeight={cardHeight}
                        homeLoaderWidth={cardWidth}
                    />
                </View>



                <ScrollView style={{ marginVertical: moderateScaleVertical(24) }} horizontal showsHorizontalScrollIndicator={false}>
                    <BannerLoader
                        // isVendorLoader
                        homeLoaderHeight={itemHeight}
                        homeLoaderWidth={itemWidth}
                    />
                    <BannerLoader
                        // isVendorLoader
                        homeLoaderHeight={itemHeight}
                        homeLoaderWidth={itemWidth}
                    />
                    <BannerLoader
                        // isVendorLoader
                        homeLoaderHeight={itemHeight}
                        homeLoaderWidth={itemWidth}
                    />
                    <BannerLoader
                        // isVendorLoader
                        homeLoaderHeight={itemHeight}
                        homeLoaderWidth={itemWidth}
                    />
                </ScrollView>

                <BannerLoader homeLoaderHeight={moderateScaleVertical(180)} viewStyles={{ marginBottom: moderateScale(16) }} />


            </ScrollView>
        </WrapperContainer>
    );
};

export default DashBoardFiveV2ApiLoader;