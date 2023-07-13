import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import Video from 'react-native-video'
import imagePath from '../constants/imagePath'
import FastImage from 'react-native-fast-image'
import { moderateScale } from '../styles/responsiveSize'

export default function VideoComp({
    source = '',
    resizeMode = "contain",
    containerStyle = {},
    videoStyle = {},
    onLoad = () => { },
    currentMessage = '',
    pause = true
}) {
    const videoRef = useRef(null)
    const [paused, setPaused] = useState(pause)


    return (
        <View style={{ ...containerStyle, }}>
            {!!currentMessage?.isLoading ?
                <FastImage
                    source={{ uri: currentMessage?.mediaUrl }}
                    style={{
                        height: moderateScale(140),
                        width: moderateScale(250),
                        borderRadius: moderateScale(4),
                    }}

                /> : <Video
                    ref={videoRef}
                    source={source}
                    onLoad={onLoad}
                    onEnd={() => videoRef?.current.seek(0)}
                    paused={paused}
                    style={{ ...videoStyle, height: "100%", width: "100%", }}
                    resizeMode={resizeMode}
                />}
            <TouchableOpacity
                onPress={() => setPaused(!paused)}
                style={{ position: 'absolute', alignSelf: 'center', height: 50, width: 50, zIndex: 1, }}
            >
                <Image
                    source={paused ? imagePath.icPlayVideo : imagePath.icPauseVideo} // Replace with your play/pause button images
                    style={{ width: 50, height: 50 }}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({})