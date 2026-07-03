const { Client, GatewayIntentBits, Collection } = require("discord.js");
const express = require("express");

const config = require("./config");
const { loadCommands, loadEvents } = require("./handlers/botHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

const app = express();
const port = config.PORT;

client.commands = new Collection();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "ONLINE",
    bot: client.user ? client.user.tag : "Not logged in",
    guilds: client.guilds.cache.size,
    users: client.users.cache.size,
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "Healthy", timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log("[WEBSERVER] Bot HTTP Server running on ", port);
});

(async () => {
  try {
    await loadCommands(client);
    await loadEvents(client);

    console.log("Handlers loaded successfully");

    await client.login(config.DISCORD_TOKEN);
  } catch (error) {
    console.error("Error starting bot: ", error);
    process.exit(1);
  }
})();

module.exports = client;
