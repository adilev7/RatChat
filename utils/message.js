const dayjs = require("dayjs");

const formatMessage = (user, text) => {
  return {
    user,
    text,
    time: dayjs().format("H:mm"),
  };
};

module.exports = formatMessage;
