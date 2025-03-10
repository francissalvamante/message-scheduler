const Message = require("../models/messages");
const { EmbedBuilder } = require("discord.js");
const { TZDate } = require("@date-fns/tz");
const {
  addMinutes,
  addHours,
  addDays,
  addWeeks,
  addMonths,
  format,
} = require("date-fns");

const digitPatt = /[0-9]/g;
const alphaPatt = /[a-zA-Z]/g;

module.exports = {
  updateMessage: async (message) => {
    const amount = message.interval.match(digitPatt).join();
    const unit = message.interval.match(alphaPatt).join();

    const messageDate = new Date(`${message.startDate} ${message.time}`);

    let newDate;
    switch (unit) {
      case "m":
        newDate = addMinutes(messageDate, amount);
        break;
      case "h":
        newDate = addHours(messageDate, amount);
        break;
      case "d":
        newDate = addHours(messageDate, amount * 24);
        break;
      case "w":
        newDate = addWeeks(messageDate, amount);
        break;
      case "M":
        newDate = addMonths(messageDate, amount);
        break;
    }

    const startDate = format(newDate, "MM/dd/yy");
    const time = format(newDate, "HH:mm");

    await Message.findByIdAndUpdate(message._id, {
      startDate,
      time,
    });
  },
  fetchAndSendAllScheduledMessages: async (client, startDate, time) => {
    const messagesToday = await Message.find({
      startDate,
      time,
    });

    messagesToday.forEach(async (message) => {
      const channel = client.channels.cache.get(message.channel);

      // const embed = new EmbedBuilder()
      // .setTitle("Desert Storm Battlefield starting in 10 mins")
      // .setDescription(
      //   "Participants of Desert Storm Battlefield, please login to participate in the event and secure this weeks win!"
      // )
      // .setImage(
      //   "https://c2c.fp.guinfra.com/file/671b157ceb2b2ed6d07735295xUbfU2U03"
      // )
      // .setThumbnail(
      //   "https://play-lh.googleusercontent.com/rg30p5lancZwLdV2UE8zzPcnCAotFFnt0jIM9fu66TNP9v89uqF6L5tSFOvYjvUB_Gsa"
      // )
      // .setColor("#ff0000");

      const embed = new EmbedBuilder()
        .setTitle(message.title)
        .setDescription(message.body);
      await channel.send({ embeds: [embed] });
      await module.exports.updateMessage(message);
    });
  },
};
