//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
const GradientButton = () => {
  return (
    <View style={styles.container}>
      <Text>GradientButton</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
height:42,
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default GradientButton;
