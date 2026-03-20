const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const TranslationRoute = require("../../models/translationRoute");
const logger = require("pino")();

module.exports = {
  name: "translation-remove",
  description: "Remove a translation route by its ID.",
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  options: [
    {
      name: "route-id",
      description: "The ID of the translation route to remove (from /translation-list).",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const routeId = interaction.options.getString("route-id");

    try {
      const deleted = await TranslationRoute.findOneAndDelete({
        _id: routeId,
        guildId: interaction.guildId,
      });

      if (!deleted) {
        return interaction.reply({
          content: "No route found with that ID in this server.",
          ephemeral: true,
        });
      }

      logger.info(`🗑️ Translation route ${routeId} removed.`);
      await interaction.reply(`Translation route \`${routeId}\` removed.`);
    } catch (error) {
      if (error.name === "CastError") {
        return interaction.reply({
          content: "Invalid ID format.",
          ephemeral: true,
        });
      }
      logger.error(`Error removing translation route: ${error}`);
      await interaction.reply({
        content: "An unexpected error occurred.",
        ephemeral: true,
      });
    }
  },
};
