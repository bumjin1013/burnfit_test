import moment from "moment";

export const generateCalendar = (currentMonth: Date) => {
  const startOfPrevMonth = moment(currentMonth).subtract(1, "month").startOf("month").startOf("week");
  const startOfCurrentMonth = moment(currentMonth).startOf("month").startOf("week");
  const endOfNextMonth = moment(currentMonth).add(1, "month").endOf("month").endOf("week");

  const days = [];
  let current = startOfPrevMonth.clone();

  while (current.isBefore(endOfNextMonth)) {
    days.push(current.clone());
    current.add(1, "day");
  }

  return days;
};
