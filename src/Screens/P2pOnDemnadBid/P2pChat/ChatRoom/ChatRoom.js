import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import _, { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import WrapperContainer from '../../../../Components/WrapperContainer';
import imagePath from '../../../../constants/imagePath';
import strings from '../../../../constants/lang';
import navigationStrings from '../../../../navigation/navigationStrings';
import actions from '../../../../redux/actions';
import colors from '../../../../styles/colors';
import { moderateScale, moderateScaleVertical, textScale } from '../../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../../styles/theme';
import { showError } from '../../../../utils/helperFunctions';
import socketServices from '../../../../utils/scoketService';
import stylesFun from './styles';

export default function ChatRoom({ navigation, route }) {
    const { themeToggle, themeColor, appData, currencies, languages, appStyle } = useSelector((state) => state?.initBoot);
    const { dineInType } = useSelector((state) => state?.home);

    const fontFamily = appStyle?.fontSizeData;
    const userData = useSelector((state) => state?.auth?.userData);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const paramData = route?.params;

    const styles = stylesFun({ fontFamily, isDarkMode });
    const [state, setState] = useState({ roomData: [], isLoading: true });
    const { roomData, isLoading } = state;
    const updateState = (data) => setState((state) => ({ ...state, ...data }));
    const roomDataRef = useRef([]);
    const isFocused = useIsFocused();

    useFocusEffect(
        useCallback(() => {
            if (userData?.auth_token) {
                fetchData();
            }
        }, [navigation]),
    );
    useFocusEffect(
        useCallback(() => {
            if (!userData?.auth_token) {
                actions.setAppSessionData('on_login');
                return;
            }
            if (!!userData?.auth_token && !appData?.profile?.socket_url) {
                showError('Invalid socket url');
                return;
            } else {
                if (socketServices) {
                    socketServices.on('new-app-message', (data) => {
                        fetchData();
                    });
                }
                return () => {
                    socketServices.removeListener('new-app-message');
                };
            }
        }, [navigation]),
    );
    const fetchData = async () => {
        try {
            let headerData = {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
            };
            let apiData = {
                sub_domain: '192.168.101.88', //this is static value
                type:
                    dineInType == 'p2p'
                        ? 'user_to_user'
                        : paramData?.type == 'agent_chat'
                            ? 'agent_to_user'
                            : 'vendor_to_user',
                db_name: appData?.profile?.database_name,
                client_id: String(appData?.profile.id),
                p2p_id: String(userData?.vendor_id),
                vendor_id: String(userData?.vendor_id),
            };
            if (paramData?.allVendors) {
                apiData['vendor_id'] = paramData?.allVendors.map((val) => val.id);
            } else {
                apiData['order_user_id'] = String(userData?.id);
            }
            console.log('api data+++', apiData);
            const res =
                dineInType == 'p2p'
                    ? await actions.fetchP2pUserToUsertChat(apiData, headerData)
                    : paramData?.type == 'user_chat'
                        ? await actions.fetchUserChat(apiData, headerData)
                        : paramData?.type == 'vendor_chat'
                            ? await actions.fetchVendorChat(apiData, headerData)
                            : await actions.fetchAgentChat(apiData, headerData);
            updateState({ isLoading: false });
            if (!!res?.roomData && !_.isEmpty(res?.roomData) && isFocused) {
                roomDataRef.current = res.roomData;
                updateState({ roomData: res.roomData });
            }
            console.log('room res++++', res);
        } catch (error) {
            console.log('error raised in start chat api', error);
            showError(error?.message);
            updateState({ isLoading: false });
        }
    };
    const goToChatRoom = useCallback((item) => {
        navigation.navigate(navigationStrings.CHAT_SCREEN, {
            data: { ...item, id: item?.order_vendor_id, is_chat: true },
        });
    }, []);

    const getOrderNumber = (item) => {

        // Split the string by hyphens ("-")
        const parts = item?.room_id.split('-');

        // Get the last element of the resulting array
        const valueAfterLastHyphen = parts[parts.length - 1];

        return !!valueAfterLastHyphen ? valueAfterLastHyphen : false
    }

    const getUniqueByProperty = (arr, property) => {
        return arr.reduce((unique, item) => {
            const hasProperty = unique.some((uniqueItem) => uniqueItem[property] === item[property]);
            if (!hasProperty) {
                unique.push(item);
            }
            return unique;
        }, []);
    }

    const renderItem = useCallback(({ item, index }) => {
        let reciver_data_room = item?.user_Data.filter((item, inx) => {
            if (item?.user_id != userData?.id) {
                return item
            }
        })
        let isAnyMessage = _.isEmpty(item?.chat_Data);
        return (
            <TouchableOpacity
                onPress={() => goToChatRoom(item)}
                style={{
                    borderTopWidth: index == 0 ? 1 : 0,
                    borderBottomWidth: 1,
                    backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.white,
                    padding: moderateScale(16),
                    borderColor: colors.textGreyO
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 0.95,

                        }}>
                        <FastImage
                            source={
                                _.isEmpty(item?.user_Data)
                                    ? imagePath.icDefaultImg
                                    : { uri: item?.user_Data[0]?.display_image }
                            }
                            resizeMode={'cover'}
                            style={{
                                width: moderateScale(45),
                                height: moderateScale(45),
                                borderRadius: moderateScale(45) / 2,
                                backgroundColor: colors.blackOpacity05,
                            }}
                        />

                        <View
                            style={{
                                marginLeft: moderateScale(12),
                                alignItems: 'flex-start',
                                flex: 1,
                            }}>
                            {!isAnyMessage ? (
                                <Text
                                    style={{
                                        fontFamily: fontFamily?.regular,
                                        color: isDarkMode ? MyDarkTheme?.colors?.text : colors.black,
                                        fontSize: textScale(16),

                                    }}>
                                    {
                                        !isEmpty(item?.user_Data) ? getUniqueByProperty(item?.user_Data, "user_id")?.map((item, inx) => {
                                            return `${inx > 0 ? ', ' : ''}${item?.username}`

                                        }) : item?.user_Data[0]?.username
                                    }
                                </Text>


                            ) : (
                                <Text
                                    style={{
                                        fontFamily: fontFamily?.regular,
                                        color: isDarkMode ? MyDarkTheme?.colors?.text : colors.black,
                                        fontSize: textScale(16),

                                    }}>
                                    {item?.vendor_name || userData?.name}
                                </Text>
                            )}
                            {!isAnyMessage ?
                                <View>
                                    {
                                        !!item?.chat_Data[0]?.is_media ? <View style={{
                                            flexDirection: "row",
                                            alignItems: "center"
                                        }}>
                                            <Image
                                                source={item?.chat_Data[0]?.mediaType == "image/jpeg" ? imagePath.icCamera : imagePath.icVideoCamera} style={{
                                                    height: 15, width: 15,
                                                    tintColor: colors.textGreyQ
                                                }} />
                                            <Text style={{
                                                fontFamily: fontFamily?.regular,
                                                color: isDarkMode ? MyDarkTheme?.colors?.text : colors.black,
                                                fontSize: textScale(12),
                                                opacity: 0.5,
                                            }}> {item?.chat_Data[0]?.mediaType == "image/jpeg" ? "Photo" : "Video"}</Text>
                                        </View> :
                                            <Text numberOfLines={2} style={{
                                                fontFamily: fontFamily?.regular,
                                                color: isDarkMode ? MyDarkTheme?.colors?.text : colors.black,
                                                fontSize: textScale(12),
                                                opacity: 0.5,
                                            }}>
                                                {item?.chat_Data[0]?.message}
                                            </Text>}
                                </View> : <Text
                                    style={{
                                        fontFamily: fontFamily?.regular,
                                        fontSize: textScale(10),
                                        color: colors.blueB,
                                    }}>
                                    • New Chat
                                </Text>}

                        </View>
                    </View>

                    <View>
                        {!!getOrderNumber(item) && <Text style={{
                            marginTop: moderateScaleVertical(4)
                        }}>#{getOrderNumber(item)}</Text>}

                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: moderateScaleVertical(4)
                        }}>

                            {!!item?.isRaiseIssue && <Image source={imagePath.redFlag} style={{
                                height: 20,
                                width: 20,
                                marginRight: 4
                            }} />}
                            <Text style={{ ...styles.timeStyle, textAlign: 'right' }}>
                                {moment(!isAnyMessage ? item?.chat_Data[0]?.created_date : item?.created_date).format('hh:mm A')}
                            </Text>

                        </View>
                    </View>

                </View>

            </TouchableOpacity>
        );
    }, [isDarkMode]);

    const listEmptyComponent = useCallback(() => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text
                    style={{
                        fontSize: textScale(16),
                        fontFamily: fontFamily.bold,
                        color: isDarkMode ? colors.white : colors.black,
                    }}>
                    {strings.CHAT_EMPTY_ROOM}
                </Text>
            </View>
        );
    }, [isDarkMode]);
    const awesomeChildListKeyExtractor = useCallback(
        (item) => `awesome-child-key-${item?._id}`,
        [roomData],
    );
    const itemSeparatorComponent = useCallback(() => {
        return <View style={styles.borderStyle} />;
    }, []);
    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}

            isLoading={isLoading}>
            <Text style={{
                fontFamily: fontFamily?.bold,
                fontSize: textScale(18),
                marginLeft: moderateScale(16),
                marginVertical: moderateScaleVertical(20),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black
            }}>Chats</Text>
            <View style={{
                flex: 1
            }}>
                <FlatList
                    data={roomData}
                    renderItem={renderItem}
                    ListEmptyComponent={!isLoading && listEmptyComponent}
                    keyExtractor={awesomeChildListKeyExtractor}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            </View>
        </WrapperContainer>
    );
}
