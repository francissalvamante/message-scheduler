const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const TranslationRoute = require("../../models/translationRoute");
const logger = require("pino")();

const LANGUAGE_CHOICES = [
  { name: "English", value: "en" },
  { name: "Indonesian", value: "id" },
  { name: "Korean", value: "ko" },
  { name: "Japanese", value: "ja" },
  { name: "Chinese (Simplified)", value: "zh" },
  { name: "Spanish", value: "es" },
  { name: "French", value: "fr" },
  { name: "German", value: "de" },
  { name: "Thai", value: "th" },
  { name: "Vietnamese", value: "vi" },
  { name: "Arabic", value: "ar" },
  { name: "Hindi", value: "hi" },
  { name: "Portuguese", value: "pt" },
  { name: "Russian", value: "ru" },
];

module.exports = {
  name: "translation-add",
  description: "Add a translation route from a source channel to a target channel.",
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  options: [
    {
      name: "source-channel",
      description: "The channel to watch for messages to translate.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "target-channel",
      description: "The channel to post translated messages in.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "target-language",
      description: "The language to translate messages into.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: LANGUAGE_CHOICES,
    },
  ],
  callback: async (client, interaction) => {
    const sourceChannel = interaction.options.getChannel("source-channel");
    const targetChannel = interaction.options.getChannel("target-channel");
    const targetLanguage = interaction.options.getString("target-language");

    if (sourceChannel.id === targetChannel.id) {
      return interaction.reply({
        content: "Source and target channels cannot be the same.",
        ephemeral: true,
      });
    }

    try {
      const route = new TranslationRoute({
        guildId: interaction.guildId,
        sourceChannelId: sourceChannel.id,
        targetChannelId: targetChannel.id,
        targetLanguage,
        createdBy: interaction.user.id,
      });

      await route.save();
      logger.info("💾 New translation route saved!");

      const langName = LANGUAGE_CHOICES.find((l) => l.value === targetLanguage)?.name ?? targetLanguage;
      await interaction.reply(
        `Translation route added: ${sourceChannel} → ${targetChannel} (${langName})`
      );
    } catch (error) {
      if (error.code === 11000) {
        return interaction.reply({
          content: "That route already exists.",
          ephemeral: true,
        });
      }
      logger.error(`Error saving translation route: ${error}`);
      await interaction.reply({
        content: "An unexpected error occurred.",
        ephemeral: true,
      });
    }
  },
};
