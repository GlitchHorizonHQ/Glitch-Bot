import fs from "fs";
import { PermissionsBitField, REST, Routes } from "discord.js";
import type { BotClient, SlashCommand, App, Handler } from "../types";
import client from "../index";

const args = process.argv.slice(2);

const api = new REST({ version: "10" }).setToken(client.settings.token);

async function getSlashCommands(client: BotClient | null) {
  const folder = fs.readdirSync("./commands/slash");
  const slash_commands: any[] = [];

  for (const dir of folder) {
    const commands = fs
      .readdirSync(`./commands/slash/${dir}`)
      .filter(
        (f) => (f.endsWith(".js") || f.endsWith(".ts")) && !f.startsWith("-"),
      );

    for (const file of commands) {
      const fileWithoutExtension = file.replace(/\.[jt]s$/, "");
      const commandModule = await import(
        `../commands/slash/${dir}/${fileWithoutExtension}.js`
      );
      const command: SlashCommand = commandModule.default || commandModule;

      if (command) {
        if (client) client.slashCommands.set(command.name, command);

        slash_commands.push({
          name: command.name,
          description: command.description,
          type: command.type,
          options: command.options || null,
          default_permissions: command.default_permission || null,
          default_member_permission: command.default_member_permissions
            ? PermissionsBitField.resolve(
                command.default_member_permissions,
              ).toString()
            : null,
          integration_types: command.integration_types || [0],
          contexts: command.contexts || [0],
        });
      }
    }
  }

  return slash_commands;
}
