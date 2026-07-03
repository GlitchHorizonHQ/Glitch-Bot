import {
  Client,
  Collection,
  ChatInputCommandInteraction,
  Message,
  AutocompleteInteraction,
  ModalSubmitInteraction,
  PermissionsString,
  ApplicationCommandType,
  ApplicationCommandOptionData,
  ColorResolvable,
} from "discord.js";

import type { ILogObj } from "tslog";
import type { CustomLogger } from "../utils/logger";

export interface BotClient extends Client {
  settings: {
    prefix: string;
    color: ColorResolvable;
    http_port: number;
    token: string;
  };
  logger: CustomLogger<ILogObj>;
  commands: Collection<string, MessageCommand>;
  events: Collection<string, BotEvent>;
  aliases: Collection<string, string>;
  slashCommands: Collection<string, SlashCommand | App>;
  modals: Collection<string, Modal>;
}

export interface SlashCommand {
  name: string; // Name of the Slash Command
  description: string; // Description of the Slash Command
  type: ApplicationCommandType.ChatInput;
  cooldown?: number; // How long the command can be used again
  options?: ApplicationCommandOptionData[];
  default_permission?: boolean | null;
  default_member_permissions?: PermissionString[];
  user_perms?: PermissionsString[];
  bot_perms?: PermissionsString[];
  integration_types?: number[];
  contexts?: number[];
  execute: (
    client: BotClient,
    interaction: ChatInputCommandInteraction,
  ) => Promise<void>;
  autocomplete?: (
    interaction: AutocompleteInteraction,
    client?: BotClient,
  ) => Promise<void>;
}

export interface MessageCommand {
  name: string; // Name of the Message Command
  description: string; // Description of the Message Command
  cooldown?: number; // How long the command can be used again
  aliases?: string[];
  category?: string;
  user_perms?: PermissionsString[];
  bot_perms?: PermissionsString[];
  execute: (
    client: BotClient,
    message: Message,
    args: string[],
  ) => Promise<void>;
}

export interface BotEvent {
  name: string; // Name of the event
  once?: boolean; // If the event should run once
  execute: (client: BotClient, ...args: any[]) => Promise<void>;
}

export interface Modal {
  custom_id: string;
  execute: (
    client: BotClient,
    interaction: ModalSubmitInteraction,
  ) => Promise<void>;
}

export interface App {
  name: string;
  type: ApplicationCommandType.User | ApplicationCommandType.Message;
  default_permission?: boolean | null;
  default_member_permissions?: PermissionsString[];
  execute: (client: BotClient, interaction: any) => Promise<void>;
}

export interface Handler {
  name: string;
  execute: (client: BotClient) => Promise<void>;
}

export interface Config {
  prefix: string;
  color: string;
  http_port: number;
  token: string;
}

declare global {
  interface String {
    brightYellow: string;
    brightGreen: string;
    brightBlue: string;
  }
}
