const { Client, IntentsBitField } = require("discord.js");
require("dotenv").config();
const eventHandler = require("./handlers/eventHandler");
const mongoose = require("mongoose");
const cron = require("node-cron");
const converter = require("./utils/dateConverter");
const fetchAndUpdateMessage = require("./utils/fetchAndUpdateMessage");
const logger = require("pino")();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async () => {
  try {
    const uri = process.env.MONGODB_URI.replace(
      "<db_username>",
      process.env.MONGODB_USERNAME
    ).replace("<db_password>", process.env.MONGODB_PASSWORD);
    await mongoose.connect(uri);
    logger.info("🪣 ✅ Connected to DB");
  } catch (error) {
    logger.error(`❎ An unexpected error has occured: ${error}`);
  }

  eventHandler(client);
  cron.schedule("* * * * *", async () => {
    try {
      const startDate = converter.dateConverter();
      const time = converter.currentTime();

      await fetchAndUpdateMessage.fetchAndSendAllScheduledMessages(
        client,
        startDate,
        time
      );
    } catch (error) {
      logger.error(`An unexpected error has occured ${error}`);
    }
  });
  logger.info("🕛 cronjob scheduled");
})();

client.login(process.env.TOKEN);
