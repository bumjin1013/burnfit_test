import {StyleSheet} from 'react-native';
import React from 'react';
import BottomTab from './BottomTab';
import {NavigationContainer} from '@react-navigation/native';

const Navigation = () => {
  return (
    <NavigationContainer>
      <BottomTab />
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
