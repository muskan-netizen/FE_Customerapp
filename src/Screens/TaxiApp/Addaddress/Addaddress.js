//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
const Addaddress = () => {
  return (
    <View style={styles.container}>
      <Text>Addaddress</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
 
    justifyContent: 'center',
    alignItems: 'center',

  },
});

//make this component available to the app
export default Addaddress;
