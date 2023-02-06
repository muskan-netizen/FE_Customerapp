//import liraries
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import { getItem } from '../../utils/utils';

// create a component
const ShortCode = ({navigation}) => {


  useEffect(()=>{
    initApiHit()
  },[])

  const initApiHit = async () => {
    alert("start api hiting")

    const res = await getItem("setPrimaryLanguage");

    let header = {};

    if (!!res?.primary_language?.id) {
      header = {
        // code:'f9cf93',
        code: 'f235c4',
        // language: res?.primary_language?.id,
      };
    } else {
      header = {
        // code:'f9cf93',

        code: 'f235c4',
      };
    }
    actions.initApp({}, header, false, null, null, true)
      .then((res) => {
        console.log("header response--->", res);
        alert("end api hiting")
        navigation.navigate(navigationStrings.SIGN_UP)
   
      })
      .catch((error) => {
        console.log(error, "error>>>>>error");
        alert("error in")
      });
  };

  return (
    <View style={styles.container}>
      <Text>ShortCode</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default ShortCode;
