const { format } = require("date-fns");
const { formatInTimeZone } = require("date-fns-tz");

const TIME_ZONE = "Asia/Singapore";

module.exports = {
  dateConverter: () => {
    return formatInTimeZone(new Date(), TIME_ZONE, "MM/dd/yy");
  },
  currentTime: () => {
    return formatInTimeZone(new Date(), TIME_ZONE, "HH:mm");
  },
};
