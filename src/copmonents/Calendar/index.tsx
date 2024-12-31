import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moment from "moment";
import {PanGestureHandler} from "react-native-gesture-handler";
import Animated, {useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, withSpring} from "react-native-reanimated";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(moment().toDate());
  const [currentMonth, setCurrentMonth] = useState(moment().startOf("month").toDate());

  const collapsedHeight = 30; // 주간 높이
  const expandedHeight = 200; // 월간 높이
  const translateY = useSharedValue(0);
  const isCollapsed = useSharedValue(false);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      const newTranslateY = context.startY + event.translationY;
      translateY.value = Math.max(Math.min(newTranslateY, expandedHeight - collapsedHeight), 0);
    },
    onEnd: () => {
      if (translateY.value > (expandedHeight - collapsedHeight) / 2) {
        // 기준치 이상 내려가면 월간 뷰로 전환
        translateY.value = withSpring(expandedHeight - collapsedHeight);
        isCollapsed.value = false;
      } else {
        // 기준치 이하면 주간 뷰로 전환
        translateY.value = withSpring(0);
        isCollapsed.value = true;
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    height: collapsedHeight + translateY.value,
  }));

  const generateCalendar = () => {
    const startOfMonth = moment(currentMonth).startOf("month");
    const endOfMonth = moment(currentMonth).endOf("month");

    const days = [];
    let current = startOfMonth.clone().startOf("week");

    while (current.isBefore(endOfMonth.clone().endOf("week"))) {
      days.push(current.clone());
      current.add(1, "day");
    }

    return days;
  };

  const renderDays = () => {
    const calendarDays = generateCalendar();
    return (
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => {
          const isSelected = moment(selectedDate).isSame(day, "day");
          const isCurrentMonth = moment(currentMonth).isSame(day, "month");
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedDate(day.toDate())}
              style={[styles.dayContainer, isSelected && styles.selectedDay, !isCurrentMonth && styles.otherMonthDay]}>
              <Text style={styles.dayText}>{day.date()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderDayHeaders = () => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    return (
      <View style={styles.dayHeaders}>
        {daysOfWeek.map((day, index) => (
          <Text key={index} style={styles.dayHeaderText}>
            {day}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentMonth(moment(currentMonth).subtract(1, "month").toDate())}>
          <Text>{"<"}</Text>
        </TouchableOpacity>
        <Text>{moment(currentMonth).format("YYYY년 MM월")}</Text>
        <TouchableOpacity onPress={() => setCurrentMonth(moment(currentMonth).add(1, "month").toDate())}>
          <Text>{">"}</Text>
        </TouchableOpacity>
      </View>
      {renderDayHeaders()}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.calendarBody, animatedStyle]}>{renderDays()}</Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dayHeaders: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayHeaderText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: "#555",
  },
  calendarBody: {
    overflow: "hidden",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayContainer: {
    width: "14.28%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    color: "black",
  },
  selectedDay: {
    backgroundColor: "green",
    borderRadius: 20,
  },
  otherMonthDay: {
    color: "#ccc",
  },
});
