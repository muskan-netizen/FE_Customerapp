import React, { Fragment } from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import Animated, { interpolate } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { height, moderateScale, textScale } from '../styles/responsiveSize';
import { View } from 'react-native';
import navigationStrings from '../navigation/navigationStrings';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';



const CustomDrawerContent = (props) => {

  const navigation = useNavigation()
  const userData = useSelector(state => state)

  console.log("userDatauserData", userData)

  return (

    <View style={{ flex: 1, backgroundColor: 'black' }}>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 0.8, backgroundColor: 'pink' }}>
          <View
            style={{
              backgroundColor: 'black',
              alignItems: 'center'
            }}
          >
            {/* <FastImage 
        source={{uri: }}
        />
       */}
          </View>
          <DrawerItem
            label={'Home'}
            onPress={() => navigation.navigate(navigationStrings.HOME)}
          />



          <DrawerItem
            label={'Privacy Policy'}
            onPress={() =>
              navigation.navigate(navigationStrings.WEBLINKS, { id: 1 })
            }
            style={{
              backgroundColor: 'red'
            }}
          />

          <DrawerItem
            label={'Terms & Conditions'}
            onPress={() =>
              navigation.navigate(navigationStrings.WEBLINKS, { id: 2 })
            }
          />
        </View>


        <View style={{ flex: 0.2, backgroundColor: 'red', }}>
          <DrawerItem
            label={'Login kar'}
            onPress={() =>
              navigation.navigate(navigationStrings.WEBLINKS, { id: 1 })
            }
            style={{
              backgroundColor: 'red'
            }}
            labelStyle={{
              textAlign:'center'
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};
export default React.memo(CustomDrawerContent);
