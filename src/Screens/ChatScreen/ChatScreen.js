import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'

import { GiftedChat, Bubble } from 'react-native-gifted-chat';
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
import { getImageUrl } from '../../utils/helperFunctions';
import { moderateScale, moderateScaleVertical, textScale } from '../../styles/responsiveSize';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

const messageWrapperStyle = {
  left: {
    backgroundColor: 'red',
    borderBottomLeftRadius: 0,
  },
  right: {
    backgroundColor: 'black',
    borderBottomEndRadius: 0,
  },
};
const messageTextStyle = {
  left: {
    // fontFamily: fontFamily.regular,
  },
  right: {
    // fontFamily: fontFamily.regular,
  },
};

export default function ChatScreen({ navigation, route }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params.data;
  console.log(paramData, 'paramData');

  // const { profile } = appData



  const fontFamily = appStyle?.fontSizeData;



  const { appData, themeColors, currencies, languages, appStyle } = useSelector((state) => state.initBoot);
  const userData = useSelector((state) => state?.auth?.userData);

  console.log("appDataappData", appData)

  const [messages, setMessages] = useState([])
  const [state, setState] = useState({
    isLoading: false,
    roomStatus: null
  })
  const { isLoading, roomStatus } = state


  console.log("userDatauserData", userData)

  const updateState = (data) => setState((state) => ({ ...state, ...data }))

  useEffect(() => {
    socketServices.initializeSocket();
  }, [navigation]);


  useFocusEffect(
    useCallback(() => {
      socketServices.on("new-message", (data) => {
        console.log(data, "data to be emitted in chat screen");
        fetchAllMessages()
      });
      return () => {
        console.log("listener removed");
        socketServices.removeListener("new-message");
        socketServices.removeListener('save-message');
      };
    }, [])
  );



  useEffect(() => {
    (async () => {
      try {
        const apiData = {
          sub_domain: '192.168.101.88',
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
        if (!!res?.roomData) {
          updateState({ roomStatus: res.roomData })
        }
      } catch (error) {
        console.log('error raised in start chat api', error)
      }
    })();
    // setMessages([])
  }, [])


  useEffect(() => {
    fetchAllMessages()
    // fetchAllRoomUser()
  }, [])


  const fetchAllMessages = async () => {
    try {
      const apiData = `/${paramData?._id}`
      const res = await actions.getAllMessages(apiData, {})
      console.log('fetchAllMessages res', res)
      if (!!res) {
        // let filterArry = res.map((val, i) => {
        //   return {
        //     ...val,
        //     createdAt: new Date(val?.created_date),
        //     text: val.message,
        //     user: {
        //       _id: val?.from_id == userData?.id ? userData?.id : val?.to_id,
        //       name: val?.username,
        //       avatar: val?.from_id == userData?.id ? getImageUrl(
        //         userData?.source?.proxy_url,
        //         userData?.source?.image_path,
        //         '200/200',
        //       ) : val?.display_image,
        //     },
        //     // sent: true,
        //     // // Mark the message as received, using two tick
        //     // received: true,
        //     // // Mark the message as pending with a clock loader
        //     // pending: true,
        //   }
        // })
        setMessages(res.reverse())
      }
    } catch (error) {
      console.log('error raised in fetchAllMessages api', error)
    }
  }

  console.log("messagesmessagesmessages", messages)

  const fetchAllRoomUser = async () => {
    try {
      const apiData = `/${paramData?._id}`
      const res = await actions.getAllRoomUser(apiData, {}, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      console.log('fetchAllMessages res', res)
    } catch (error) {
      console.log('error raised in fetchAllMessages api', error)
    }
  }


  const onSend = useCallback(async (messages = []) => {
    if (String(messages[0].text).trim().length < 1) {
      return;
    }
    try {
      const apiData = {
        room_id: roomStatus?._id || paramData?._id,
        message: messages[0].text,
        user_type: 'user',
        to_message: 'to_vendor',
        from_message: 'from_user',
        user_id: userData?.id,
        email: userData.email,
        username: userData?.name,
        display_image: getImageUrl(
          userData?.source?.proxy_url,
          userData?.source?.image_path,
          '200/200',
        ),
        sub_domain: '192.168.101.88',
        //'room_name' =>$data->name,
        chat_type: 'vendor_to_user',
      }
      const res = await actions.sendMessage(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      console.log('on send message res', res)
      socketServices.emit('save-message', res);
      const message = {
        _id: userData.id,
        from_id: userData.id,
        message: messages[0].text,
        createdAt: new Date(),
        username: userData?.name,
        display_image: getImageUrl(
          userData?.source?.proxy_url,
          userData?.source?.image_path,
          '200/200',
        )
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, message))
    } catch (error) {
      console.log('error raised in fetchAllMessages api', error)
    }
  }, [])


  console.log("roomStatusroomStatus", roomStatus)


  const renderMessage = useCallback((props) => {
    console.log("render props message", props)
    const { currentMessage } = props
    let isRight = currentMessage?.from_id == userData?.id
    return (
      <View style={{
        alignSelf: isRight ? 'flex-end' : 'flex-start',
        backgroundColor: isRight ? '#0084ff' : '#f0f0f0',
        paddingVertical: moderateScaleVertical(4),
        paddingHorizontal: moderateScale(8),
        borderRadius: 8,
        marginBottom: 10,
        marginHorizontal: 16,
      }}>

        <View style={{ flexDirection: "row" }}>
          <FastImage

            source={{
              uri: currentMessage?.display_image,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable
            }}
            style={{
              ...styles.radiusStyle,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity30,

            }}
          />
          <View style={{ marginLeft: 8 }}>
            <Text style={{
              fontSize: textScale(14),
              // fontFamily: fontFamily.medium,
              textTransform: 'capitalize',
              color: isRight ? colors.white : colors.black,
              // fontWeight: 'bold'
            }}>{currentMessage?.username}</Text>
            <Text style={{
              fontSize: textScale(12),
              // fontFamily: fontFamily.medium,
              textTransform: 'capitalize',
              color: isRight ? colors.white : colors.black
            }}>{currentMessage?.message}</Text>
            <Text style={{
              fontSize: textScale(12),
              // fontFamily: fontFamily.medium,
              textTransform: 'lowercase',
              color: isRight ? colors.white : colors.black,
              alignSelf: isRight ? 'flex-end' : 'flex-start',
            }}>{moment(currentMessage?.created_date).format('LT')}</Text>
          </View>



        </View>

      </View>
    )
  })

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
        centerTitle={`# ${roomStatus?.room_id || paramData?.room_id || ''}`}

      />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userData?.id,
        }}

        // showUserAvatar
        renderMessage={renderMessage}
      />
    </WrapperContainer>
  )
}


const styles = StyleSheet.create({

  questionToReplyView: {
    backgroundColor: colors.lightGray,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  questionToReplyText: {

    color: colors.black,
    padding: 5,
  },

});