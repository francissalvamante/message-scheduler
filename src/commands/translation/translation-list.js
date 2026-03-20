const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const TranslationRoute = require("../../models/translationRoute");
const logger = require("pino")();

module.exports = {
  name: "translation-list",
  description: "List all translation routes in this server.",
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  options: [],
  callback: async (client, interaction) => {
    try {
      const routes = await TranslationRoute.find({ guildId: interaction.guildId });

      if (!routes.length) {
        return interaction.reply({
          content: "No translation routes configured for this server.",
          ephemeral: true,
        });
      }

      const lines = routes.map((r) => {
        return `**ID:** \`${r._id}\`\n<#${r.sourceChannelId}> → <#${r.targetChannelId}> (\`${r.targetLanguage}\`)`;
      });

      const embed = new EmbedBuilder()
        .setTitle("Translation Routes")
        .setDescription(lines.join("\n\n"))
        .setColor(0x5865f2);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error(`Error listing translation routes: ${error}`);
      await interaction.reply({
        content: "An unexpected error occurred.",
        ephemeral: true,
      });
    }
  },
};
