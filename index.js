const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
  ]
});

const APPEAL_LINK = 'https://discord.gg/RuTATTeRqb';

client.on('ready', () => {
  console.log(Bot connecté en tant que ${client.user.tag});
});

client.on('guildBanAdd', async (ban) => {
  try {
    await ban.user.send(
      Tu as été banni du serveur **${ban.guild.name}**.\n\nPour faire une demande de débann, rejoins ce serveur : ${APPEAL_LINK}
    );
    console.log(MP envoyé à ${ban.user.tag});
  } catch (err) {
    console.log(Impossible d'envoyer un MP à ${ban.user.tag});
  }
});

client.login(process.env.TOKEN);
