const Message = require("../../models/messages");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { gearUpgradeCost } = require("../../constants/gearUpgradeCost");

module.exports = {
  name: "compute-gear",
  description:
    "Calculate how much gold and ores are needed to upgrade a gear from Level X to Level Y.",
  options: [
    {
      name: "current",
      description: "Current gear level",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "target",
      description: "Target gear level",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const current = interaction.options.getNumber("current");
    const target = interaction.options.getNumber("target");

    const totalCost = {
      gold: 0,
      ore: 0,
    };
    for (let i = current - 1; i < target; i++) {
      totalCost.gold += gearUpgradeCost[i].gold;
      totalCost.ore += gearUpgradeCost[i].ore;
    }

    const embed = new EmbedBuilder()
      .setTitle(
        `Total gold and ore cost to upgrade from Level ${current} to Level ${target}`
      )
      .setColor(0x776f0d)
      .addFields({
        name: "Gold",
        value: totalCost.gold.toString(),
        inline: true,
      })
      .addFields({
        name: "Ore",
        value: totalCost.ore.toString(),
        inline: true,
      });

    interaction.reply({ embeds: [embed] });
  },
  // deleted: true,
  // devOnly: Boolean;
  // testOnly: Boolean,
  // options: Object[]
};
