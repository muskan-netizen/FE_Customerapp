import React, { useState, useCallback, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import socketServices from '../../utils/scoketService';
import { useSelector } from 'react-redux';
import { useDarkMode } from 'react-native-dark-mode';
import imagePath from '../../constants/imagePath';
import Header from '../../Components/Header';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../../styles/colors';
import { MyDarkTheme } from '../../styles/theme';
import WrapperContainer from '../../Components/WrapperContainer';
import actions from '../../redux/actions';
import { moderateScale } from '../../styles/responsiveSize';
import _ from 'lodash';
import { showError } from '../../utils/helperFunctions';
import navigationStrings from '../../navigation/navigationStrings';


export default function ChatRoom({ navigation, route }) {
    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
    const { appData, themeColors, currencies, languages, appStyle } = useSelector((state) => state.initBoot);
    const userData = useSelector((state) => state?.auth?.userData);

    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
    const paramData = route?.params.data;
    console.log(paramData, 'paramData');

    const [state, setState] = useState({
        roomData: [],
        isLoading: false,
    })
    const { roomData, isLoading } = state

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    useEffect(() => {
        (async () => {
            try {
                let headerData = {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                }
                let apiData ={
                    sub_domain: '127.0.0.1',
                }
                const res = paramData == 'user_chat' ? await actions.fetchUserChat(apiData, headerData) : await actions.fetchVendorChat(apiData, headerData)
                if (!!res?.chatrooms && !_.isEmpty(res?.chatrooms)) {
                    updateState({ roomData: res.chatrooms })
                }
                console.log("room res", res)
            } catch (error) {
                console.log('error raised in start chat api', error)
                showError(error?.message)
            }
        })();

    }, [])


    const goToChatRoom = useCallback((item) => {
        navigation.navigate(navigationStrings.CHAT_SCREEN, {data: {...item, id: item?.order_vendor_id} })
    }, [])

    const renderItem = useCallback(({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => goToChatRoom(item)}
            >
                <Text>Hi</Text>
            </TouchableOpacity>
        )
    }, [])

    const listEmptyComponent = useCallback(() => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Chat Room Empty</Text>
            </View>
        )
    }, [])

    const awesomeChildListKeyExtractor = useCallback((item) => `awesome-child-key-${item?._id}`, [roomData]);

    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
            statusBarColor={colors.white}
            isLoadingB={isLoading}
        >
            <Header
                leftIcon={
                    appStyle?.homePageLayout === 2
                        ? imagePath.backArrow
                        : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                            ? imagePath.icBackb
                            : imagePath.back
                }
                centerTitle={'Chat Room'}

            />
            <View style={styles.container}>
                <FlatList
                    data={roomData}
                    renderItem={renderItem}
                    ListEmptyComponent={listEmptyComponent}
                    keyExtractor={awesomeChildListKeyExtractor}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            </View>
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: moderateScale(16)
    },
});

