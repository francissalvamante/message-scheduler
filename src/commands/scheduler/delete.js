const { ApplicationCommandOptionType } = require("discord.js");
const Message = require("../../models/messages");
const logger = require("pino")();

module.exports = {
  name: "delete",
  description: "Delete a scheduled message.",
  options: [
    {
      name: "id",
      description:
        "ID of message to be deleted! (Be careful as this is irreversible)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const id = await interaction.options.getString("id");

    try {
      await Message.findByIdAndDelete(id);
      logger.info("🗑️ Successfully deleted message");
    } catch (error) {
      logger.error(`There was an error deleting the message: ${error}`);
    }

    interaction.reply("Message deleted!", { ephemeral: true });
  },
  // deleted: true,
  // devOnly: Boolean;
  // testOnly: Boolean,
  // options: Object[]
};
