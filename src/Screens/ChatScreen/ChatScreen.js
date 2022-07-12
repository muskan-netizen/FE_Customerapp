import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'

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


export default function ChatScreen({ navigation, route }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params.data;
  console.log(paramData, 'paramData');

  // const { profile } = appData




  const { appData, themeColors, currencies, languages, appStyle } = useSelector((state) => state.initBoot);
  const userData = useSelector((state) => state?.auth?.userData);

  console.log("appDataappData", appData)

  const [messages, setMessages] = useState([])
  const [state, setState] = useState({
    isLoading: false,
  })
  const { isLoading } = state


  console.log("userDatauserData", userData)
 
  const updateState = (data) => setState((state) => ({ ...state, ...data }))

  useEffect(() => {
    (async () => {
      try {
        const apiData = {
          sub_domain: '127.0.0.1',
          client_id: 1,
          db_name: appData?.profile?.database_name,
          user_id: userData?.id,
          type: 'vendor_to_user',
          vendor_order_id: Number(paramData?.id),
          vendor_id: Number(paramData?.vendor_id),
          order_id: Number(paramData?.order_id)
        }
        const res = await actions.onStartChat(apiData, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        })
        console.log('start chat res', res)
      } catch (error) {
        console.log('error raised in start chat api', error)
      }
    })();
    // setMessages([])
  }, [])


  useEffect(() => {
    socketServices.initializeSocket(null);
  }, [navigation]);


  useFocusEffect(
    useCallback(() => {
      socketServices.on("ChangesResp", (data) => {
        console.log(data, "data to be emitted");
        alert('api hit again')
      });
      return () => {
        console.log("listener removed");
        socketServices.removeListener("ChangesResp");
      };
    }, [])
  );

  const onSend = useCallback((messages = []) => {
    if (String(messages[0].text).trim().length < 1) {
      return;
    }

    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

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
        centerTitle={'Chat'}

      />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </WrapperContainer>
  )
}

