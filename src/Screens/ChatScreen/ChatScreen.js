import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'

import { GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import socketServices from '../../utils/scoketService';


export default function ChatScreen({navigation}) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',

        },
      },
    ])
  }, [])
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  useEffect(() => {
    // const focus = navigation.addListener('focus', async () => {
    socketServices.initializeSocket(null);
    // })
    // return focus;
    }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        <View style={{ height: 60 }} />
      </SafeAreaView>

    </View>
  )
}

