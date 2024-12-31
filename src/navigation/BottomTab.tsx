import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import LibraryScreen from '../screens/LibraryScreen';
import MyPageScreen from '../screens/MyPageScreen';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        // tabBarIcon: ({focused, color, size}) => {
        //   if (route.name === "HomeScreen") {
        //     return focused ? <HomeSelected /> : <Home />;
        //   } else if (route.name === "ExploreScreen") {
        //     return focused ? <ExploreSeleted /> : <Explore />;
        //   } else if (route.name === "InboxScreen") {
        //     return focused ? <InboxSelected /> : <Inbox />;
        //   } else if (route.name === "ProfileScreen") {
        //     return focused ? <ProfileSelected /> : <Profile />;
        //   }
        // },
        // tabBarIconStyle: {alignSelf: "center"},
        // tabBarActiveTintColor: color.deepGreen,
        // tabBarLabelStyle: {fontSize: 10, fontFamily: "Poppins-SemiBold", marginTop: ios ? 6 : -8, marginBottom: ios ? 0 : 4},
        // keyboardHidesTabBar: !ios,
        // tabBarAllowFontScaling: false,
        // headerTitleAlign: "center",
      })}>
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="CalendarScreen" component={CalendarScreen} />
      <Tab.Screen name="LibraryScreen" component={LibraryScreen} />
      <Tab.Screen name="MyPageScreen" component={MyPageScreen} />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({});
