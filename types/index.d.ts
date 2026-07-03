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
  };
  logger: CustomLogger<ILogObj>;
  commands: Collection<string, MessageCommand>;
}

export interface SlashCommand {}

export interface MessageCommand {}

export interface BotEvent {}

export interface Modal {}

export interface App {}

export interface Handler {}

export interface Config {}

declare global {
  interface String {
    brightYellow: string;
    brightGreen: string;
    brightBlue: string;
  }
}
