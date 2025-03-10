module.exports = {
  name: "list",
  description: "Show list of scheduled message.",
  callback: async (client, interaction) => {
    interaction.reply("List");
  },
  deleted: true,
  // devOnly: Boolean;
  // testOnly: Boolean,
  // options: Object[]
};
