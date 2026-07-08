import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  AutocompleteInteraction,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import type { BotClient, SlashCommand } from "../../../types";

const ORG = "GlitchHorizonHQ";
const ORG_URL = `https://github.com/${ORG}`;

let repoCache: string[] = [];
let lastFetch = 0;

type GitHubRepo = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  open_issues_count: number;
  updated_at: string;
  default_branch: string;
  owner: {
    avatar_url: string;
  };
};

async function getRepos(): Promise<string[]> {
  // Cache repositories for 5 minutes
  if (Date.now() - lastFetch < 5 * 60 * 1000 && repoCache.length) {
    return repoCache;
  }

  const response = await fetch(
    `https://api.github.com/orgs/${ORG}/repos?per_page=100&sort=updated`,
  );

  if (!response.ok) return [];

  const repos = (await response.json()) as GitHubRepo[];

  repoCache = repos.map((repo: any) => repo.name);
  lastFetch = Date.now();

  return repoCache;
}

const command: SlashCommand = {
  name: "github",
  description: "View information about the Glitch Horizon GitHub.",
  type: ApplicationCommandType.ChatInput,

  options: [
    {
      name: "organization",
      description: "View the Glitch Horizon GitHub organization.",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "repo",
      description: "View information about one of our repositories.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "Repository name",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
    },
  ],

  autocomplete: async (
    interaction: AutocompleteInteraction,
    client?: BotClient,
  ): Promise<void> => {
    const focused = interaction.options.getFocused().toLowerCase();

    try {
      const repos = await getRepos();

      const choices = repos
        .filter((repo) => repo.toLowerCase().includes(focused))
        .slice(0, 25)
        .map((repo) => ({
          name: repo,
          value: repo,
        }));

      await interaction.respond(choices);
    } catch (error) {
      client?.logger.error(error);

      if (!interaction.responded) {
        await interaction.respond([]);
      }
    }
  },

  execute: async (
    client: BotClient,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> => {
    await interaction.deferReply().catch(console.error);

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "organization") {
      const embed = new EmbedBuilder()
        .setColor(client.settings.color)
        .setTitle("Glitch Horizon GitHub")
        .setURL(ORG_URL)
        .setDescription(
          [
            "Explore our open-source projects and contribute to the development of Glitch Horizon.",
            "",
            `**Organization:** \`${ORG}\``,
            `**Repositories:** ${repoCache.length || "Public"}`,
          ].join("\n"),
        )
        .setThumbnail(
          "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        )
        .setFooter({
          text: "Thank you for supporting Glitch Horizon!",
        });

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Visit GitHub")
          .setStyle(ButtonStyle.Link)
          .setURL(ORG_URL)
          .setEmoji("🔗"),
      );

      await interaction.editReply({
        embeds: [embed],
        components: [row],
      });

      return;
    }

    if (subcommand === "repo") {
      const repoName = interaction.options.getString("name", true);

      try {
        const response = await fetch(
          `https://api.github.com/repos/${ORG}/${repoName}`,
        );

        if (!response.ok) {
          await interaction.editReply({
            content: `❌ Repository \`${repoName}\` was not found.`,
          });

          return;
        }

        const repo = (await response.json()) as GitHubRepo;

        const embed = new EmbedBuilder()
          .setColor(client.settings.color)
          .setTitle(repo.full_name)
          .setURL(repo.html_url)
          .setDescription(repo.description || "No description provided.")
          .addFields(
            {
              name: "⭐ Stars",
              value: repo.stargazers_count.toLocaleString(),
              inline: true,
            },
            {
              name: "🍴 Forks",
              value: repo.forks_count.toLocaleString(),
              inline: true,
            },
            {
              name: "💻 Language",
              value: repo.language ?? "Unknown",
              inline: true,
            },
            {
              name: "🐞 Issues",
              value: repo.open_issues_count.toString(),
              inline: true,
            },
            {
              name: "📅 Last Updated",
              value: `<t:${Math.floor(
                new Date(repo.updated_at).getTime() / 1000,
              )}:R>`,
              inline: true,
            },
            {
              name: "🌿 Default Branch",
              value: repo.default_branch,
              inline: true,
            },
          )
          .setThumbnail(repo.owner.avatar_url);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel("Open Repository")
            .setStyle(ButtonStyle.Link)
            .setURL(repo.html_url)
            .setEmoji("📂"),
        );

        await interaction.editReply({
          embeds: [embed],
          components: [row],
        });

        return;
      } catch (error) {
        console.error(error);

        await interaction.editReply({
          content: "❌ Failed to fetch repository information.",
        });

        return;
      }
    }
  },
};

export default command;
