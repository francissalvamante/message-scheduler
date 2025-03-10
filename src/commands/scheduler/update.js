const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const Message = require("../../models/messages");
const logger = require("pino")();

module.exports = {
  name: "update",
  description: "Update a scheduled message.",
  options: [
    {
      name: "id",
      description: "ID of message to be edited.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "title",
      description: "Updated message title",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "body",
      description: "Updated message content",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "channel",
      description: "Updated channel configuration",
      type: ApplicationCommandOptionType.Channel,
    },
    {
      name: "start-date",
      description: "Updated date (format MM/dd/YY)",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "time",
      description: "Updated time (format HH:MM 24-hr format)",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "interval",
      description: "Updated interval (e.g 5m, 1h, 1d, 1w, 1M)",
      type: ApplicationCommandOptionType.String,
    },
  ],
  callback: async (client, interaction) => {
    const id = interaction.options.getString("id");
    const newMessageDto = {
      title: interaction.options.getString("title"),
      body: interaction.options.getString("body"),
      channel: interaction.options.getChannel("channel")?.id,
      startDate: interaction.options.getString("start-date"),
      time: interaction.options.getString("time"),
      interval: interaction.options.getString("interval"),
    };

    Object.keys(newMessageDto).forEach(
      (element) => newMessageDto[element] ?? delete newMessageDto[element]
    );

    try {
      logger.info("🕛 Saving updates");
      const newRecord = await Message.findByIdAndUpdate(id, newMessageDto, {
        new: true,
      });
      logger.info("✅ Update successful");

      const embed = new EmbedBuilder()
        .setTitle("Message successfully updated")
        .addFields(
          {
            name: "Title",
            value: newRecord.title,
          },
          {
            name: "Body",
            value: newRecord.body,
          },
          {
            name: "Channel",
            value: `#${client.channels.cache.get(newRecord.channel)?.name}`,
          },
          {
            name: "Start Date",
            value: newRecord.startDate,
          },
          {
            name: "time",
            value: newRecord.time,
          },
          {
            name: "interval",
            value: newRecord.interval,
          }
        );
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error(`An unexpected error has occured while saving: ${error}`);
    }
  },
  // deleted: true,
  // devOnly: Boolean;
  // testOnly: Boolean,
  // options: Object[]
};
