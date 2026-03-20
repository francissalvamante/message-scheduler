const { Schema, model } = require("mongoose");

const translationRouteSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    index: true,
  },
  sourceChannelId: {
    type: String,
    required: true,
  },
  targetChannelId: {
    type: String,
    required: true,
  },
  targetLanguage: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

translationRouteSchema.index(
  { guildId: 1, sourceChannelId: 1, targetChannelId: 1, targetLanguage: 1 },
  { unique: true }
);

module.exports = model("TranslationRoute", translationRouteSchema);
