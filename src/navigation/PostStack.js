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
        name={navigationStrings.POST_CATEGORY}
        component={Screens.Post}
      />
      <Stack.Screen
        name={navigationStrings.ATTRIBUTEINFORMATION}
        component={Screens.AttributeInformation}
      />
    </Stack.Navigator>
  );
}
