const Message = require("../../models/messages");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "list",
  description: "Show list of scheduled message.",
  callback: async (client, interaction) => {
    console.log("interaction", interaction.member.guild.id);
    const messages = await Message.find({
      guildId: interaction.member.guild.id,
    });

    const embed = new EmbedBuilder().setTitle(
      "List of all announcements/messages scheduled:"
    );

    messages.forEach((message, idx) => {
      embed.addFields({
        name: `${idx + 1}. ${message.title} - ${message._id}`,
        value: "",
        inline: false,
      });
    });

    embed.setFooter({
      text: "To update any message, use /update and provide the id located after the title",
    });

    interaction.reply({ embeds: [embed] });
  },
  // deleted: true,
  // devOnly: Boolean;
  // testOnly: Boolean,
  // options: Object[]
};
