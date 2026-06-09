const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const http = require('http');

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ]
});
client.on('guildMemberAdd', async (member) => {
    try {
        await member.send(
           
        );
    } catch (error) {
        console.log("Impossible d'envoyer le message privé :", error);
    }
});
const APPEAL_LINK = 'https://discord.gg/RuTATTeRqb';

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot en ligne !');
}).listen(PORT, () => {
  console.log('Serveur HTTP actif sur le port ' + PORT);
});

const commands = [
  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre et lui envoyer un MP')
    .addUserOption(function(option) {
      return option.setName('membre').setDescription('Le membre a bannir').setRequired(true);
    })
    .addStringOption(function(option) {
      return option.setName('raison').setDescription('Raison du ban').setRequired(false);
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('expulser')
    .setDescription('Expulser un membre et lui envoyer un MP')
    .addUserOption(function(option) {
      return option.setName('membre').setDescription('Le membre a expulser').setRequired(true);
    })
    .addStringOption(function(option) {
      return option.setName('raison').setDescription('Raison de l expulsion').setRequired(false);
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .toJSON(),
];

client.once('ready', async function() {
  console.log('Bot connecte en tant que ' + client.user.tag);
  var rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('Commandes enregistrees !');
  } catch (err) {
    console.error('Erreur enregistrement commandes:', err.message);
  }
});

client.on('interactionCreate', async function(interaction) {
  if (!interaction.isChatInputCommand()) return;

  await interaction.deferReply({ ephemeral: true });

  if (interaction.commandName === 'ban') {
    var user   = interaction.options.getUser('membre');
    var raison = interaction.options.getString('raison') || 'Aucune raison fournie';
    try {
      await user.send('Tu as ete banni du serveur ' + interaction.guild.name + '.\nRaison : ' + raison + '\n\nPour faire une demande de debannissement : ' + APPEAL_LINK);
    } catch(e) { console.log('Impossible d envoyer un MP'); }
    try {
      await interaction.guild.members.ban(user, { reason: raison });
      await interaction.editReply('Banni : ' + user.tag + ' - Raison : ' + raison);
    } catch(e) {
      await interaction.editReply('Impossible de bannir ' + user.tag);
    }
  }

  if (interaction.commandName === 'expulser') {
    var user   = interaction.options.getUser('membre');
    var raison = interaction.options.getString('raison') || 'Aucune raison fournie';
    try {
      await user.send('Tu as ete expulse du serveur ' + interaction.guild.name + '.\nRaison : ' + raison + '\n\nTu peux rejoindre ici : ' + APPEAL_LINK);
    } catch(e) { console.log('Impossible d envoyer un MP'); }
    try {
      var member = await interaction.guild.members.fetch(user.id);
      await member.kick(raison);
      await interaction.editReply('Expulse : ' + user.tag + ' - Raison : ' + raison);
    } catch(e) {
      await interaction.editReply('Impossible d expulser ' + user.tag);
    }
  }
});

client.login(TOKEN);
