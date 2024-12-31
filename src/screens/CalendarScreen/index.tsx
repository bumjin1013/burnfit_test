import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import Calendar from '../../copmonents/Calendar';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View>
      <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({});
