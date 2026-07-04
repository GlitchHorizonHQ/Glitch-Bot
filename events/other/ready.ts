import { ActivityType, Events } from "discord.js";
import type { BotClient, BotEvent, SlashCommand, App } from "../../types";
import { bold } from "ansis";

const event: BotEvent = {
  name: Events.ClientReady,
  execute: async (client: BotClient) => {
    client.logger.info(
      `${bold.cyanBright`${client.user!.username}`} Online! --> Users: ${client.users.cache.size}, Guilds: ${client.guilds.cache.size}`,
    );

    client.user!.setActivity("@GlitchHorizonHQ on GitHub");
    client.user!.setStatus("online");
  },
};

export default event;
