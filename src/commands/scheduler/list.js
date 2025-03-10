const Message = require("../../models/messages");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "list",
  description: "Show list of scheduled message.",
  callback: async (client, interaction) => {
    const messages = await Message.find({
      guildId: interaction.member.guild.id,
    });

    const embed = new EmbedBuilder()
      .setTitle("List of all announcements/messages scheduled:")
      .setColor(0x776f0d)
      .setFooter({
        text: "To update any message, use /update and provide the id located after the title",
      });

    messages.forEach((message, idx) => {
      embed.addFields({
        name: `${idx + 1}. ${message.title} - ${message._id}`,
        value: "",
        inline: false,
      });
    });

    interaction.reply({ embeds: [embed] });
  },
  // deleted: true,
  // devOnly: Boolean;
  // testOnly: Boolean,
  // options: Object[]
};
