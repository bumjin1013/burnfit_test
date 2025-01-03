import React, {useEffect, useRef, useState} from "react";
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moment from "moment";
import {FlatList, PanGestureHandler} from "react-native-gesture-handler";
import Animated, {useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, withTiming, runOnJS} from "react-native-reanimated";
import {ArrowLeft} from "../../assets/svgs";
import {generateCalendar} from "../../functions/calendar";

const weekWidth = Dimensions.get("window").width - 32;
const dayWidth = weekWidth / 7;

const Calendar = () => {
  const ref = useRef<FlatList>(null);
  const currentMonthRef = useRef(moment().startOf("month").toDate());

  const [currentMonth, setCurrentMonth] = useState(moment().startOf("month").toDate());
  const [selectedDate, setSelectedDate] = useState(moment().toDate());
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const translateY = useSharedValue(0);
  const weekTranslateY = useSharedValue(0);

  const collapsedHeight = 40;
  const expandedHeight = 200;

  const weekHeight = collapsedHeight;

  const calendarDays = generateCalendar(currentMonth);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startY = translateY.value;
      context.startWeekTranslateY = weekTranslateY.value;
    },
    onActive: (event, context) => {
      runOnJS(setIsCollapsed)(false);
      const newTranslateY = context.startY + event.translationY;

      translateY.value = Math.max(Math.min(newTranslateY, expandedHeight - collapsedHeight), 0);

      if (selectedWeek === 0) {
        weekTranslateY.value = 0;
      } else {
        const progress = translateY.value / (expandedHeight - collapsedHeight);
        const interpolatedWeekTranslateY = -selectedWeek * weekHeight * (1 - progress);
        weekTranslateY.value = Math.max(Math.min(interpolatedWeekTranslateY, 0), -selectedWeek * weekHeight);
      }
    },
    onEnd: (event, context) => {
      const shouldExpandToMonthlyView = translateY.value > (expandedHeight - collapsedHeight) / 2;

      if (shouldExpandToMonthlyView) {
        weekTranslateY.value = withTiming(0, {duration: 300});
        translateY.value = withTiming(expandedHeight - collapsedHeight, {duration: 300}, () => {
          runOnJS(setIsCollapsed)(false);
        });
      } else {
        translateY.value = withTiming(0, {}, () => {
          runOnJS(setIsCollapsed)(true);
        });

        weekTranslateY.value = withTiming(-selectedWeek * weekHeight, {duration: 300});
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    height: collapsedHeight + translateY.value,
  }));

  const weekAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: weekTranslateY.value}],
  }));

  useEffect(() => {
    // 월이 바뀔 떄 선택한 날짜가 없으면 selectedWeek === 0으로 선택된 날짜가 있으면 selectedWeek 가 선택된 날짜에 있게
    // 현재 월 달력에 선택된 날짜가 없으면 0번째 주로 이동
    let selectedIndex = calendarDays.findIndex((calendarDay) => moment(calendarDay).isSame(selectedDate, "day"));
    if (selectedIndex === -1) {
      console.log("ASDF");
      setSelectedWeek(0);
      ref?.current?.scrollToIndex({index: 0});
    } else {
      //선택된 날짜가 있는 주로 이동

      setSelectedWeek(Math.floor(selectedIndex / 7));
      ref?.current?.scrollToIndex({index: selectedIndex - (selectedIndex % 7)});
    }
  }, [currentMonth]);

  const weekCalendar = () => {
    return (
      <FlatList
        ref={ref}
        horizontal
        data={calendarDays}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={selectedWeek * 7}
        getItemLayout={(data, index) => ({length: dayWidth, offset: dayWidth * index, index})}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          const isSelected = moment(selectedDate).isSame(item, "day");

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedDate(item.toDate());
                setSelectedWeek(Math.floor(index / 7) % 5);
              }}
              style={[styles.dayContainer]}>
              <Text style={[styles.dayText, isSelected && styles.selectedDay]}>{item.date()}</Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const renderDays = () => {
    return (
      <>
        <Animated.View style={{opacity: isCollapsed ? 1 : 0, position: "absolute", top: 0, zIndex: 100}}>{weekCalendar()}</Animated.View>
        <Animated.View style={[styles.calendarGrid, weekAnimatedStyle, {opacity: isCollapsed ? 0 : 1}]}>
          {calendarDays.map((day, index) => {
            const isSelected = moment(selectedDate).isSame(day, "day");
            const selectedIndex = calendarDays.findIndex((calendarDay) => moment(calendarDay).isSame(day, "day")) || 0;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  ref?.current?.scrollToIndex({index: index - day.day()});
                  setSelectedDate(day.toDate());
                  setSelectedWeek(Math.floor(selectedIndex / 7));
                }}
                style={[styles.dayContainer]}>
                <Text style={[styles.dayText, isSelected && styles.selectedDay]}>{day.date()}</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </>
    );
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const WeekOfDays = () => {
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
          <ArrowLeft />
        </TouchableOpacity>
        <Text>{moment(currentMonth).format("YYYY년 MM월")}</Text>
        <TouchableOpacity onPress={() => setCurrentMonth(moment(currentMonth).add(1, "month").toDate())}>
          <ArrowLeft style={{transform: [{rotate: "180deg"}]}} />
        </TouchableOpacity>
      </View>
      <WeekOfDays />
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.calendarBody, animatedStyle]}>{renderDays()}</Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
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
    width: dayWidth,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    color: "black",
  },
  selectedDay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 20,
    width: 30,
    height: 30,
    padding: 6,
    textAlign: "center",
  },
});

export default Calendar;
