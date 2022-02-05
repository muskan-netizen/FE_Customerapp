import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions, StatusBar } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import GradientButton from '../../Components/GradientButton';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import { height, moderateScale, width } from '../../styles/responsiveSize';
import { setItem } from '../../utils/utils';

const styles = StyleSheet.create({
    slide: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'blue',
    },
    image: {
        // width: Dimensions.get('screen').width,
        // height: Dimensions.get('screen').height,
        width: '100%',
        height: '100%'
        // marginVertical: 32,
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    title: {
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
    },
    activeDotStyle: {
        backgroundColor: colors.themeColor
    },
    buttonCircle: {
        marginBottom: moderateScale(25),
        marginHorizontal: moderateScale(25)
    }
});

export default class AppIntro extends React.Component {
    state = {
        index: 0,
        lastIndex: -1,
        slides: []
    }

    componentDidMount = () => {

        const temp = this.props.route.params.images.map((el, index) => {
            return {
                key: index + 1,
                title: '',
                text: '',
                // image: {uri: `${el.file_name.image_fit}${Math.round(Dimensions.get('screen').width)}/${Math.round(Dimensions.get('screen').height)}${el.file_name.image_path}`},
                image: `${el.file_name.image_fit}2000/3000${el.file_name.image_path}`,
                backgroundColor: '#22bcb5',
            }
        })

        this.setState({ ...this.state, slides: temp })
        setItem('firstTime', true)
    }

    _renderItem = ({ item }) => {
        return (
            <View style={[styles.slide, { backgroundColor: 'white' }]}>
                <FastImage
                    source={{
                        uri: item.image,
                        priority: FastImage.priority.high,
                        cache: FastImage.cacheControl.immutable
                    }}
                    style={{
                        height:height,
                        width:width
                    }}
                    resizeMode={FastImage.resizeMode.cover}

                />
            </View>
        );
    }

    _renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <GradientButton btnText={strings.START} btnStyle={{ paddingHorizontal: 10 }} onPress={() => this.props.navigation.push(navigationStrings.TAB_ROUTES)} />
            </View>
        );
    };

    onSlideChange = (el, i) => {
    }

    onScroll = () => {
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar translucent backgroundColor="transparent" />
                <View style={{ flex: 0.9 }}>
                    <AppIntroSlider
                        data={this.state.slides}
                        renderDoneButton={() => <View></View>}
                        onEndReached={(el) => console.log(el)}
                        renderItem={this._renderItem}
                        activeDotStyle={styles.activeDotStyle}
                        onSlideChange={(el, i) => this.onSlideChange(el, i)}
                        onScroll={() => this.onScroll()}
                        renderNextButton={() => <View></View>}
                    />
                </View>
                <View style={{ flex: 0.1 }}>
                    {this._renderDoneButton()}
                </View>
            </View>
        );
    }
}