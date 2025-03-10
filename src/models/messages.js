const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  },
  interval: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

module.exports = model("Message", messageSchema);
