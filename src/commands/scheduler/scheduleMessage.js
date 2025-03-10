const { ApplicationCommandOptionType } = require("discord.js");
const Message = require("../../models/messages");
const logger = require("pino")();

module.exports = {
  name: "schedule-message",
  description: "Schedule a message to send on a specific channel.",
  options: [
    {
      name: "title",
      description: "The title of your message",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "body",
      description: "What is the message content",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "channel",
      description: "Which channel would you like it sent?",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "start-date",
      description: "When should I start sending the message? (format MM/dd/YY)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "time",
      description:
        "What time is this scheduled for? (format HH:MM 24-hr format)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "interval",
      description: "How often should I repeat this? (e.g 5m, 1h, 1d, 1w, 1M)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const newMessageDto = {
      userId: interaction.user?.id,
      guildId: interaction.member?.guild?.id,
      title: interaction.options.getString("title"),
      body: interaction.options.getString("body"),
      channel: interaction.options.getChannel("channel")?.id,
      startDate: interaction.options.getString("start-date"),
      time: interaction.options.getString("time"),
      interval: interaction.options.getString("interval"),
    };

    try {
      const newMessage = new Message(newMessageDto);

      await newMessage.save();
      logger.info("💾 New message saved!");
      await interaction.reply(
        `"${newMessageDto.title}" saved and expected to run on ${newMessageDto.startDate} at ${newMessageDto.time}`
      );
    } catch (error) {
      logger.error(`An unexpected error has occured while saving: ${error}`);
    }
  },
  // deleted: true,
  // devOnly: Boolean;
  // testOnly: Boolean,
};
