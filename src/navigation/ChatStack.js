import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import navigationStrings from './navigationStrings';
import * as Screens from '../Screens';
const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={navigationStrings.CHAT_ROOM_FOR_VENDOR}
        component={Screens.ChatRoomForVendor}
      />
      <Stack.Screen
        name={navigationStrings.CHAT_ROOM}
        component={Screens.ChatRoom}
      />
      <Stack.Screen
        name={navigationStrings.CHAT_SCREEN}
        component={Screens.ChatScreen}
      />
    </Stack.Navigator>
  );
}
