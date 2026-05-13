const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ]
});

const APPEAL_LINK = 'https://discord.gg/RuTATTeRqb';
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

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

client.on('ready', async () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log('Commandes /ban et /kick enregistrées !');
  } catch (err) {
    console.error('Erreur enregistrement commandes:', err);
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
        `Tu as été banni du serveur **${interaction.guild.name}**.\nRaison : ${raison}\n\nPour faire une demande de débann, rejoins ce serveur : ${APPEAL_LINK}`
      );
    } catch (err) {
      console.log(`Impossible d'envoyer un MP à ${user.tag}`);
    }

    try {
      await interaction.guild.members.ban(user, { reason: raison });
      await interaction.editReply(`✅ **${user.tag}** a été banni. Raison : ${raison}`);
    } catch (err) {
      await interaction.editReply(`❌ Impossible de bannir ${user.tag}.`);
    }
  }

  if (interaction.commandName === 'kick') {
    try {
      await user.send(
        `Tu as été expulsé du serveur **${interaction.guild.name}**.\nRaison : ${raison}\n\nPour rejoindre à nouveau le serveur : ${APPEAL_LINK}`
      );
    } catch (err) {
      console.log(`Impossible d'envoyer un MP à ${user.tag}`);
    }

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.kick(raison);
      await interaction.editReply(`✅ **${user.tag}** a été expulsé. Raison : ${raison}`);
    } catch (err) {
      await interaction.editReply(`❌ Impossible d'expulser ${user.tag}.`);
    }
  }
});

client.login(TOKEN);
