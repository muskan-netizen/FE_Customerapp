import React, { useState, useCallback, useEffect, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image, Platform } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat';
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
import { height, moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import _ from 'lodash';
import CircularImages from '../../Components/CircularImages';
import Modal from 'react-native-modal'
import { ScrollView } from 'react-native-gesture-handler';


export default function ChatScreen({
  route,
  onClose,
  isRefresh
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route.params.data;
  const { appData, themeColors, currencies, languages, appStyle } = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const userData = useSelector((state) => state?.auth?.userData);
  const isChatRefresh = useSelector((state) => state?.chatRefresh.isChatRefresh);
  const styles = stylesFun({ fontFamily, isDarkMode });


  const [messages, setMessages] = useState([])
  const [state, setState] = useState({
    showParticipant: false,
    isLoading: false,
    roomUsers: []
  })
  const { isLoading, roomUsers, showParticipant } = state

  const updateState = (data) => setState((state) => ({ ...state, ...data }))


  useEffect(() => {
    socketServices.on("new-message", (data) => {
      console.log(data, "data to be emitted in chat screen");
      fetchAllMessages()
      // console.log("fetchLAtestMessages", messages)
      // // let cloneDeep = _.cloneDeep(messages)
      // cloneDeep.push(data.message.chatData)
      // // setMessages(cloneDeep)
    });
    return () => {
      socketServices.removeListener("new-message");
      socketServices.removeListener('save-message');
    };
  }, [])


  useEffect(() => {
    updateState({ isLoading: true })
    fetchAllRoomUser()
    fetchAllMessages()

  }, [])


  const fetchAllMessages = async () => {
    try {
      const apiData = `/${paramData?._id}`
      const res = await actions.getAllMessages(apiData, {})
      console.log('fetchAllMessages res', res)
      updateState({ isLoading: false })
      if (!!res) {
        let filterArry = res.map((val, i) => {
          return { ...val, user: {} }
        })
        setMessages(filterArry.reverse())
      }
    } catch (error) {
      console.log('error raised in fetchAllMessages api', error)
      updateState({ isLoading: false })
    }
  }



  const fetchAllRoomUser = async () => {
    try {
      const apiData = `/${paramData?._id}`
      const res = await actions.getAllRoomUser(apiData, {}, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      console.log('fetchAllRoomUser res', res)
      if (!!res?.userData) {
        updateState({ roomUsers: res?.userData })
      }
    } catch (error) {
      console.log('error raised in fetchAllRoomUser api', error)
    }
  }


  const onSend = useCallback(async (messages = []) => {
    if (String(messages[0].text).trim().length < 1) {
      return;
    }
    try {
      const apiData = {
        room_id: paramData?._id,
        message: messages[0].text,
        user_type: 'user',
        to_message: 'to_vendor',
        from_message: 'from_user',
        user_id: userData?.id,
        email: userData.email,
        username: userData?.name,
        phone_num: `+${userData?.dial_code} ${userData.phone_number}`,
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
        auth_user_id: userData.id,
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

  const showRoomUser = useCallback((props) => {
    if (_.isEmpty(roomUsers)) {
      return null
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => updateState({ showParticipant: true })}
      >
        <CircularImages size={25} isDarkMode={isDarkMode} fontFamily={fontFamily} data={roomUsers} />
      </TouchableOpacity>
    )
  }, [roomUsers])

  const renderMessage = useCallback((props) => {
    const { currentMessage } = props
    let isRight = currentMessage?.auth_user_id == userData?.id

    if (isRight) {
      return (
        <View key={String(currentMessage._id)} style={{
          ...styles.chatStyle,
          alignSelf: 'flex-end',
          backgroundColor: '#0084ff',
          borderBottomRightRadius: 0,
        }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginHorizontal: 8, flexShrink: 1 }}>
              <Text style={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
                textTransform: 'capitalize',
                color: colors.white,

              }}>{currentMessage?.username}</Text>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{
                  ...styles.descText,
                  color: colors.white
                }}>{currentMessage?.message}</Text>
           <Text style={{...styles.timeText, color: colors.whiteOpacity77}}>{moment(currentMessage?.created_date).format('LT')}</Text>
              </View>
            </View>
          </View>
        </View>
      )
    }
    return (
      <View style={{ flexDirection: "row" }}>
        <FastImage
          source={{
            uri: currentMessage?.display_image,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable
          }}
          style={styles.cahtUserImage}
        />
        <View key={String(currentMessage._id)} style={{
          ...styles.chatStyle,
          alignSelf: 'flex-start',
          backgroundColor: '#f0f0f0',
          borderBottomLeftRadius: moderateScale(0),
          maxWidth: width / 1.2
        }}>

          <View style={{ marginHorizontal: 8, flexShrink: 1 }}>
            <Text style={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
              textTransform: 'capitalize',
              color: colors.black,
            }}>{currentMessage?.username}</Text>

              <Text style={{
                ...styles.descText,
                color: colors.black,
              }}>{currentMessage?.message}</Text>
              <Text style={styles.timeText}>{moment(currentMessage?.created_date).format('LT')}</Text>
  
          </View>
        </View>
      </View>
    )
  })

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      isLoading={isLoading}
    >
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        centerTitle={`# ${paramData?.room_id || ''}`}
        customRight={showRoomUser}
      // onPressLeft={onBack}

      />

      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{ _id: userData?.id }}
          renderMessage={renderMessage}
          isKeyboardInternallyHandled={true}
          inverted={Platform.OS !== 'web'}
          inputAccessoryViewID="done"
        />
      </View>


      <Modal
        isVisible={showParticipant}
        style={{
          margin: 0,
          justifyContent: 'flex-end'
        }}
        onBackdropPress={() => updateState({ showParticipant: false })}
      >
        <View style={{
          ...styles.modalStyle,
          backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.white,

        }}>
      
            <Text style={{
              fontFamily: fontFamily?.bold,
              fontSize: textScale(16),
              color: isDarkMode ? colors.white : colors.black
            }}>{roomUsers.length} Participants</Text>

            <TouchableOpacity activeOpacity={0.7} onPress={() => updateState({ showParticipant: false })}>
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
     


          <ScrollView >
            {roomUsers.map((val, i) => {
              return (
                <View style={{
                  marginVertical: moderateScaleVertical(8),
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <FastImage
                    source={{
                      uri: val?.display_image,
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable
                    }}
                    style={{
                      ...styles.imgStyle,
                      backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity30,
                    }}
                  />
                  <View style={{ marginLeft: moderateScale(8) }}>
                    <Text>{val?.auth_user_id == userData?.id ? 'You' : val?.username}</Text>
                    {!!val?.phone_num ? <Text>{val?.phone_num}</Text> : null}
                  </View>
                </View>
              )
            })}
          </ScrollView>
        </View>
      </Modal>
    </WrapperContainer>
  )
}



const stylesFun = ({ fontFamily, isDarkMode }) => {
  const styles = StyleSheet.create({
    imgStyle: {
      width: moderateScale(35),
      height: moderateScale(35),
      borderRadius: moderateScale(35 / 2),
    },
    modalStyle: {
      padding: moderateScale(10),
      borderTopLeftRadius: moderateScale(8),
      borderTopRightRadius: moderateScale(8),
      maxHeight: height / 2
    },
    userNameStyle: {
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      textTransform: 'capitalize',
    },
    cahtUserImage: {
      width: moderateScale(20),
      height: moderateScale(20),
      borderRadius: moderateScale(10),
      backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity30,
      marginLeft: 8
    },
    descText: {
      fontSize: textScale(12),
      fontFamily: fontFamily.regular,
      textTransform: 'capitalize',
      lineHeight: moderateScale(18),
      marginTop: moderateScaleVertical(4),
    },
    timeText: {
      fontSize: textScale(10),
      fontFamily: fontFamily.regular,
      textTransform: 'uppercase',
      color: colors.blackOpacity43,
      marginLeft: moderateScale(12),
      marginTop: moderateScaleVertical(6),
      alignSelf:'flex-end'
    },
    flexView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chatStyle: {
      paddingVertical: moderateScaleVertical(6),
      borderRadius: moderateScale(8),
      marginBottom: moderateScale(10),
      paddingHorizontal: moderateScale(2),
      maxWidth: width - 16,
      marginHorizontal: moderateScale(8),
    }
  });
  return styles
}

