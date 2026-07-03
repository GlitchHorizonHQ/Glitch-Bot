const { glob } = require("glob");

async function loadCommands(client) {
  const commandFiles = await glob("./commands/**/.js");

  console.log(`[HANDLER] Loading ${commandFiles.length} commands`);

  for (const file of commandFiles) {
    try {
      delete require.cache[require.resolve(`../${file}`)];

      const command = require(`../${file}`);

      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        console.log(`[HANDLER] Loaded command: ${command.data.name}`);
      } else {
        console.warn(
          `[HANDLER] Command ${file} is missing required properties`,
        );
      }
    } catch (error) {
      console.error(`[HANDLER] Error loading command ${file}: `, error);
    }
  }
}

async function loadEvents(client) {
  const eventFiles = await glob("./events/**/*.js");

  console.log(`[HANDLER] Loading ${eventFiles.length} events`);

  for (const file of eventFiles) {
    try {
      delete require.cache[require.resolve(`../${file}`)];

      const event = require(`../${file}`);

      if (event.name && event.execute) {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
        console.log(`[HANDLER] Loaded event: ${event.name}`);
      } else {
        console.warn(`[HANDLER] Event ${file} is missing required properties`);
      }
    } catch (error) {
      console.error(`[HANDLER] Error loading event ${file}: `, error);
    }
  }
}

module.exports = { loadCommands, loadEvents };
