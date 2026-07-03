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

export interface BotClient extends Client {}
