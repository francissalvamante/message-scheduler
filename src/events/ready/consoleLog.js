const { ActivityType } = require("discord.js");

module.exports = (client) => {
  console.log(`✅ ${client.user?.tag} is online.`);

  client.user.setActivity({
    name: "🫡 Message Scheduler awaiting orders.",
    type: ActivityType.Custom,
  });
};
