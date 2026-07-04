import fs from "fs";
import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  ColorResolvable,
} from "discord.js";
import express from "express";
import "dotenv/config";

import config from "./config.json" with { type: "json" };
import type {
  BotClient,
  Handler,
  SlashCommand,
  MessageCommand,
  BotEvent,
  Modal,
  App,
} from "./types";
import logger from "./utils/logger.js";

logger.info("Initializing client and starting...");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [
    Partials.Channel,
    Partials.User,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
  ],
}) as BotClient;

client.settings = {
  prefix: config.prefix,
  color: config.color as ColorResolvable,
  http_port: config.http_port,
};
client.logger = logger;
client.commands = new Collection<string, MessageCommand>();
client.events = new Collection<string, BotEvent>();
client.aliases = new Collection<string, string>();
client.slashCommands = new Collection<string, SlashCommand | App>();
client.modals = new Collection<string, Modal>();

export default client;

const app = express();
const port = config.http_port;

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
  logger.info(`Bot HTTP Server running on ${port}`);
});

let handlers = fs.readdirSync("./handlers");
const filteredHandlers = handlers.filter(
  (f) => (f.endsWith(".js") || f.endsWith(".ts")) && !f.startsWith("-"),
);

for (const file of filteredHandlers) {
  const fileWithoutExtension = file.replace(/\.[jt]s$/, "");
  const handlerModule = await import(`./handlers/${fileWithoutExtension}.js`);
  const handler: Handler = handlerModule.default || handlerModule;

  if (handler) await handler.execute(client);
}

client.login(process.env.token);
