const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
require("dotenv/config");

const tz = Intl.supportedValuesOf("timeZone").map((z) => ({
  name: z,
  value: z,
}));

const commands = [
  {
    name: "schedule-message",
    description: "Schedule a message to send on a specific channel",
    options: [
      {
        name: "title",
        description: "The title of your message",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "body",
        description: "What is the message content",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "channel",
        description: "Which channel would you like it sent?",
        type: ApplicationCommandOptionType.Channel,
        required: true,
      },
      {
        name: "location",
        description: "Please input the city/country you are currently in",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  {
    name: "list",
    description: "Show the list of scheduled messages",
  },
  {
    name: "delete",
    description: "Delete a scheduled message",
  },
  {
    name: "update",
    description: "Update a scheduled message",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.DBTR_ID
      ),
      { body: commands }
    );
    console.log("Slash commands were registered ✅");
  } catch (error) {
    console.error("❗An error has occured", error);
  }
})();
