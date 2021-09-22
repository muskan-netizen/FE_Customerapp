import React from 'react';
import { View, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image'
import { UIActivityIndicator } from 'react-native-indicators';
import { moderateScale } from '../styles/responsiveSize';
import { getImageUrl } from '../utils/helperFunctions';


const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
class BlurImages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showIndicator: true,
            randomColors: ''
        };
    }

    componentDidMount() {
        var w = Math.floor(Math.random() * 256);
        var x = Math.floor(Math.random() * 256);
        var y = Math.floor(Math.random() * 256);
        var z = 0.3
        var rgbaColor = "rgba(" + w + "," + x + "," + y + "," + z + ")";
        //console.log(rgbaColor)
        this.setState({
            randomColors: rgbaColor
        })
    }
    thumbnailAnimated = new Animated.Value(0);

    imageAnimated = new Animated.Value(0);

    handleThumbnailLoad = () => {
        setTimeout(() => {
            Animated.timing(this.thumbnailAnimated, {
                toValue: 1,
            }).start();
            this.setState({
                // showIndicator: false
            })
        }, 100);
    }

    onImageLoad = () => {
        setTimeout(() => {
            Animated.timing(this.imageAnimated, {
                toValue: 1,
            }).start();
            this.setState({
                showIndicator: false
            })
        }, 100);

    }

    render() {
        const {
            thumbnailSource,
            source,
            style,
            bgStyle = {},
            data,
            themeColor,
            ...props
        } = this.props;

        return (
            <View style={{ flex: 1 }} >

                <AnimatedFastImage
                    {...props}
                    source={{
                        uri: getImageUrl(
                            data?.banner?.image_fit,
                            data?.banner?.image_path,
                            '20/20',
                        ),
                        priority: FastImage.priority.high,
                    }}
                    style={[style, { opacity: this.thumbnailAnimated, alignItems: 'center' }]}
                    onLoad={this.handleThumbnailLoad}
                >
                    {this.state.showIndicator ?
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <UIActivityIndicator size={70} color={themeColor} />
                        </View>
                        : <View />}
                </AnimatedFastImage>
                <AnimatedFastImage
                    {...props}
                    source={{
                        uri: getImageUrl(
                            data?.banner?.image_fit,
                            data?.banner?.image_path,
                            '800/800',
                        ),
                        priority: FastImage.priority.low
                    }}
                    style={[styles.imageOverlay, { opacity: this.imageAnimated, alignItems: 'center' }, style]}
                    onLoadEnd={this.onImageLoad}
                >
                    {this.state.showIndicator ?
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <UIActivityIndicator size={70} color={themeColor} />
                        </View>
                        : <View />}

                </AnimatedFastImage>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
    container: {
        flex: 1
        //height: 160,
    },
});

export default BlurImages;