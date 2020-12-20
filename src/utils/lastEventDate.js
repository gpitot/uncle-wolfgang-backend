const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const msInDay = 1000 * 60 * 60 * 24;

const getLastEventDate = (eventDayString) => {
  let eventDay = 0;
  for (let i = 0; i < days.length; i += 1) {
    if (days[i] === eventDayString) {
      eventDay = i;
      break;
    }
  }
  //when is the last date that an event occurred.
  const date = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" })
  );

  const currentDay = date.getDay();
  let diff = eventDay + 1 - currentDay;
  if (diff >= 0) {
    diff = diff - 7;
  }

  const startOfDay = new Date(
    `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  );

  const subtractDays = diff * msInDay * -1;
  return new Date(startOfDay - subtractDays);
};

export { getLastEventDate };
