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
      type: ApplicationCommandOptionType.Integer,
      required: true,
      min_value: 0,
      max_value: 40,
    },
    {
      name: "target",
      description: "Target gear level",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      min_value: 0,
      max_value: 40,
    },
  ],
  callback: async (client, interaction) => {
    const current = interaction.options.getInteger("current");
    const target = interaction.options.getInteger("target");

    if (target < current) {
      interaction.reply(
        "Hey! What are you trying to pull here? Current level must be less than the target level"
      );
      return;
    }

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
        value: totalCost.gold.toLocaleString(),
        inline: true,
      })
      .addFields({
        name: "Ore",
        value: totalCost.ore.toLocaleString(),
        inline: true,
      });

    interaction.reply({ embeds: [embed] });
  },
  // deleted: true,
  // devOnly: Boolean;
  // testOnly: Boolean,
  // options: Object[]
};
