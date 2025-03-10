module.exports = {
  name: "delete",
  description: "Delete a scheduled message.",
  callback: async (client, interaction) => {
    interaction.reply("Delete");
  },
  deleted: true,
  // devOnly: Boolean;
  // testOnly: Boolean,
  // options: Object[]
};
