import {StyleSheet} from "react-native";
import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import CalendarScreen from "../screens/CalendarScreen";
import LibraryScreen from "../screens/LibraryScreen";
import MyPageScreen from "../screens/MyPageScreen";
import {Calendar, Home, Library, User} from "../assets/svgs";

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          if (route.name === "HomeScreen") {
            return <Home width={24} height={24} />;
          } else if (route.name === "CalendarScreen") {
            return <Calendar width={24} height={24} />;
          } else if (route.name === "LibraryScreen") {
            return <Library width={24} height={24} />;
          } else {
            return <User width={24} height={24} />;
          }
        },
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
