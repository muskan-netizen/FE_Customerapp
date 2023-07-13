import React, { memo, useRef, useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import {
    moderateScale,
    moderateScaleVertical,
    textScale
} from '../styles/responsiveSize';

import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import VideoPlayer from './VideoPlayer';
import moment from 'moment';

const ChatMedia = ({
    currentMessage = {},
    isRight = false,
    onPressMedia = () => { },
}) => {
    const { themeColor, themeToggle, themeColors, appStyle } = useSelector(
        state => state?.initBoot || {},
    );
    const darkthemeusingDevice = useDarkMode();
    const videoRef = useRef(null)
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const fontFamily = appStyle?.fontSizeData;

    const styles = styleFunc({ fontFamily, themeColors, isDarkMode });

    const [pdfInfo, setPdfInfo] = useState(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false)

    const handleLoadComplete = (numberOfPages, filePath) => {

        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
        const fileSize = getFileSize(filePath);

        setPdfInfo({
            name: fileName,
            pages: numberOfPages,
            size: fileSize,
        });
    };

    const getFileSize = filePath => {
        // Use a suitable method to determine the file size of the PDF
        // For example, you can use the 'react-native-fs' library's `stat()` method
        // to get the file size in bytes and then format it as required.
        // Here's an example using 'react-native-fs':
        // const stat = await RNFS.stat(filePath);
        // const fileSize = stat.size;
        // // Format the file size (e.g., convert bytes to kilobytes or megabytes)
        // const formattedSize = `${(fileSize / 1024).toFixed(2)} KB`;
        // return formattedSize;

        // For simplicity, let's assume the file size is unknown
        return '5';
    };

    return (
        <View style={{
            marginBottom: moderateScale(10),
            alignSelf: isRight ? 'flex-end' : 'flex-start',
            marginHorizontal: moderateScale(8),

        }}>
            <TouchableOpacity
                onPress={onPressMedia}
                style={{
                    ...styles.mainContainer,
                    backgroundColor: currentMessage?.mediaType == 'video/mp4' ? colors.transparent : isRight
                        ? isDarkMode
                            ? '#005246'
                            : '#e2ffd3'
                        : isDarkMode
                            ? '#363638'
                            : '#ffffff',

                }}>

                {currentMessage?.mediaType == 'application/pdf' ? (
                    <View
                        style={{
                            ...styles.chatMsgStyle,
                            height: moderateScaleVertical(80)
                        }}>
                        <Image
                            source={imagePath.icPdf}
                            style={{
                                height: moderateScale(28),
                                width: moderateScale(25),
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                height: '30%',
                            }}>

                            <View
                                style={{
                                    marginLeft: moderateScale(4),
                                    flex: 1,
                                }}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        fontFamily: fontFamily?.regular,
                                        fontSize: textScale(14),
                                    }}>
                                    {currentMessage?.mediaUrl.substring(currentMessage?.mediaUrl.lastIndexOf('/') + 1)}
                                </Text>
                            </View>
                        </View>
                    </View>
                ) : currentMessage?.mediaType == 'video/mp4' ? (
                    <View
                        containerStyle={{
                            ...styles.chatMsgStyle
                        }}>
                        <VideoPlayer
                            currentMessage={currentMessage}
                            containerStyle={{
                                ...styles.chatMsgStyle
                            }}
                            source={{ uri: currentMessage?.mediaUrl }}
                            onLoad={(event) => {
                                console.log(event, "<===videoEvent")
                                setIsVideoLoaded(true)
                            }}

                            videoStyle={{
                                ...styles.chatMsgStyle
                            }}
                            resizeMode="contain"
                        />

                        {/* } */}
                    </View>

                ) : (
                    <View style={{
                        ...styles.chatMsgStyle,
                    }}>
                        <FastImage
                            source={{ uri: currentMessage?.mediaUrl }}
                            style={styles.imgStyle}

                        />
                    </View>
                )}
                <Text
                    style={{
                        fontSize: textScale(10),
                        fontFamily: fontFamily.regular,
                        textTransform: 'uppercase',
                        color: colors.blackOpacity43,
                        marginLeft: moderateScale(12),
                        marginTop: moderateScaleVertical(6),
                        alignSelf: 'flex-end',
                        color: isDarkMode ? '#84acaa' : colors.blackOpacity40,
                    }}>
                    {moment(currentMessage?.created_date).format('LT')}
                </Text>
            </TouchableOpacity>
            {!!currentMessage?.isLoading && <Text style={{ textAlign: "right", fontSize: textScale(12), color: colors.textGreyB }}>sending...</Text>}
        </View>
    );
};

export default memo(ChatMedia);

const styleFunc = ({ fontFamily, themeColors, isDarkMode }) => {
    const styles = StyleSheet.create({
        mainContainer: {
            padding: 6,
            borderTopLeftRadius: moderateScale(8),
            borderBottomLeftRadius: moderateScale(8),
            borderBottomRightRadius: moderateScale(8)


        },
        imgStyle: {
            height: moderateScale(140),
            width: moderateScale(250),
            borderRadius: moderateScale(4),
        },
        chatMsgStyle: {
            height: moderateScale(140),
            width: moderateScale(250),
            alignItems: "center",
            justifyContent: "center",


        }
    });
    return styles;
};
