const { format } = require("date-fns");

module.exports = {
  dateConverter: () => {
    return format(new Date(), "MM/dd/yy");
  },
  currentTime: () => {
    return format(new Date(), "HH:mm");
  },
};
