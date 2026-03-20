const { PermissionFlagsBits } = require("discord.js");
const TranslationRoute = require("../../models/translationRoute");
const { translate } = require("../../utils/translate");
const logger = require("pino")();

const webhookCache = new Map();

async function getOrCreateWebhook(channel, client) {
  if (webhookCache.has(channel.id)) return webhookCache.get(channel.id);

  const webhooks = await channel.fetchWebhooks();
  let wh = webhooks.find((w) => w.owner?.id === client.user.id);
  if (!wh) wh = await channel.createWebhook({ name: "Translator" });

  webhookCache.set(channel.id, wh);
  return wh;
}

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (!message.content || message.content.trim() === "") return;

  const routes = await TranslationRoute.find({
    guildId: message.guildId,
    sourceChannelId: message.channelId,
  });

  if (!routes.length) return;

  for (const route of routes) {
    const { translatedText, detectedLang, truncated, error } = await translate(
      message.content,
      route.targetLanguage
    );

    if (error || !translatedText) {
      logger.error(`Translation failed for route ${route._id}: ${error}`);
      continue;
    }

    if (detectedLang === route.targetLanguage) continue;

    const targetChannel = client.channels.cache.get(route.targetChannelId);
    if (!targetChannel) {
      logger.warn(`Target channel ${route.targetChannelId} not found in cache.`);
      continue;
    }

    const botMember = targetChannel.guild?.members?.me;
    if (botMember && !targetChannel.permissionsFor(botMember).has(PermissionFlagsBits.ManageWebhooks)) {
      logger.warn(`Missing ManageWebhooks permission in channel ${route.targetChannelId}.`);
      continue;
    }

    try {
      const webhook = await getOrCreateWebhook(targetChannel, client);
      await webhook.send({
        content: translatedText,
        username: message.member?.displayName ?? message.author.username,
        avatarURL: message.author.displayAvatarURL(),
      });
    } catch (sendError) {
      logger.error(`Failed to send translation via webhook: ${sendError}`);
    }
  }
};
