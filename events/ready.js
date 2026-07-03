module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log("Bot has started!");

    client.user.setActivity("@GlitchHorizonHQ on GitHub", { type: 0 });
  },
};
