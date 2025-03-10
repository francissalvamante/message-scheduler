const { Client, IntentsBitField } = require("discord.js");
require("dotenv/config");
const eventHandler = require("./handlers/eventHandler");
const mongoose = require("mongoose");
const cron = require("node-cron");
const converter = require("./utils/dateConverter");
const fetchAndUpdateMessage = require("./utils/fetchAndUpdateMessage");

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
    console.log("\x1b[32m🪣 ✅ Connected to DB\x1b[0m");
  } catch (error) {
    console.log(`❎ An unexpected error has occured: ${error}`);
  }

  eventHandler(client);
  cron.schedule("* * * * *", async () => {
    console.log("running a scheduled job every minute");
    try {
      const startDate = converter.dateConverter();
      const time = converter.currentTime();

      await fetchAndUpdateMessage.fetchAndSendAllScheduledMessages(
        client,
        startDate,
        time
      );
    } catch (error) {
      console.log(`\x1b[31m An unexpected error has occured ${error}\x1b[0m`);
    }
  });
  console.log("\x1b[32m🕛 cronjob scheduled\x1b[0m");
})();

client.login(process.env.TOKEN);
