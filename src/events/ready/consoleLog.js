const { ActivityType } = require("discord.js");
const logger = require("pino")();

module.exports = (client) => {
  logger.info(`✅ ${client.user?.tag} is online.`);

  client.user.setActivity({
    name: "🫡 Message Scheduler awaiting orders.",
    type: ActivityType.Custom,
  });
};
