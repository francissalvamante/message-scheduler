const { REST, Routes } = require("discord.js");
require("dotenv/config");

const rest = new REST().setToken(process.env.TOKEN);
console.log(process.env.TOKEN, process.env.CLIENT_ID, process.env.DBTR_ID);
rest
  .delete(
    Routes.applicationCommand(process.env.CLIENT_ID, "1347485866549051392")
  )
  .then(() => console.log("Successfully deleted command"))
  .catch(console.error);
