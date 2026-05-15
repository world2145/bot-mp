const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

console.log('CLIENT_ID:', CLIENT_ID);
console.log('TOKEN existe:', !!TOKEN);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ]
});

const APPEAL_LINK = 'https://discord.gg/RuTATTeRqb';

const commands = [
  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre et lui envoyer un MP')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Le membre à bannir')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('Raison du ban')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulser un membre et lui envoyer un MP')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Le membre à expulser')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('Raison du kick')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .toJSON()
];

client.once('ready', async () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
  console.log(`CLIENT_ID utilisé: ${client.user.id}`);

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('Commandes /ban et /kick enregistrees !');
  } catch (err) {
    console.error('Erreur enregistrement commandes:', err.message);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const user = interaction.options.getUser('user');
  const raison = interaction.options.getString('raison') || 'Aucune raison fournie';

  await interaction.deferReply({ ephemeral: true });

  if (interaction.commandName === 'ban') {
    try {
      await user.send(
        `Tu as ete banni du serveur **${interaction.guild.name}**.\nRaison : ${raison}\n\nPour faire une demande de debann, rejoins ce serveur : ${APPEAL_LINK}`
      );
    } catch (err) {
      console.log(`Impossible d'envoyer un MP a ${user.tag}`);
    }

    try {
      await interaction.guild.members.ban(user, { reason: raison });
      await interaction.editReply(`OK **${user.tag}** a ete banni. Raison : ${raison}`);
    } catch (err) {
      await interaction.editReply(`Erreur: Impossible de bannir ${user.tag}.`);
    }
  }

  if (interaction.commandName === 'kick') {
    try {
      await user.send(
        `Tu as ete expulse du serveur **${interaction.guild.name}**.\nRaison : ${raison}\n\nPour rejoindre a nouveau : ${APPEAL_LINK}`
      );
    } catch (err) {
      console.log(`Impossible d'envoyer un MP a ${user.tag}`);
    }

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.kick(raison);
      await interaction.editReply(`OK **${user.tag}** a ete expulse. Raison : ${raison}`);
    } catch (err) {
      await interaction.editReply(`Erreur: Impossible d'expulser ${user.tag}.`);
    }
  }
});

client.login(TOKEN);
