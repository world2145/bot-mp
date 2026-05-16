const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const TOKEN = process.env.TOKEN;

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
      option.setName('membre')
        .setDescription('Le membre a bannir')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('Raison du ban')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('expulser')
    .setDescription('Expulser un membre et lui envoyer un MP')
    .addUserOption(option =>
      option.setName('membre')
        .setDescription('Le membre a expulser')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('Raison de l expulsion')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mettre en sourdine un membre')
    .addUserOption(option =>
      option.setName('membre')
        .setDescription('Le membre a mettre en sourdine')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('duree')
        .setDescription('Duree de la sourdine')
        .setRequired(true)
        .addChoices(
          { name: '60 secondes', value: '60' },
          { name: '5 minutes', value: '300' },
          { name: '10 minutes', value: '600' },
          { name: '1 heure', value: '3600' },
          { name: '1 jour', value: '86400' },
          { name: '1 semaine', value: '604800' },
        ))
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('Raison de la sourdine')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .toJSON(),
];

client.once('ready', async () => {
  console.log(`Bot connecte en tant que ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('Commandes enregistrees !');
  } catch (err) {
    console.error('Erreur enregistrement commandes:', err.message);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const user = interaction.options.getUser('membre');
  const raison = interaction.options.getString('raison') || 'Aucune raison fournie';

  await interaction.deferReply({ ephemeral: true });

  if (interaction.commandName === 'ban') {
    try {
      await user.send(
        `Tu as ete banni du serveur **${interaction.guild.name}**.\nRaison : ${raison}\n\nPour faire une demande de debannissement, rejoins ce serveur : ${APPEAL_LINK}`
      );
    } catch (err) {
      console.log(`Impossible d envoyer un MP a ${user.tag}`);
    }
    try {
      await interaction.guild.members.ban(user, { reason: raison });
      await interaction.editReply(`✅ **${user.tag}** a ete banni.\nRaison : ${raison}`);
    } catch (err) {
      await interaction.editReply(`❌ Impossible de bannir **${user.tag}**.`);
    }
  }

  if (interaction.commandName === 'expulser') {
    try {
      await user.send(
        `Tu as ete expulse du serveur **${interaction.guild.name}**.\nRaison : ${raison}\n\nTu peux rejoindre ici : ${APPEAL_LINK}`
      );
    } catch (err) {
      console.log(`Impossible d envoyer un MP a ${user.tag}`);
    }
    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.kick(raison);
      await interaction.editReply(`✅ **${user.tag}** a ete expulse.\nRaison : ${raison}`);
    } catch (err) {
      await interaction.editReply(`❌ Impossible d expulser **${user.tag}**.`);
    }
  }

  if (interaction.commandName === 'mute') {
    const duree = parseInt(interaction.options.getString('duree'));
    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.timeout(duree * 1000, raison);
      const dureeTexte = {
        60: '60 secondes',
        300: '5 minutes',
        600: '10 minutes',
        3600: '1 heure',
        86400: '1 jour',
        604800: '1 semaine',
      }[duree] || `${duree} secondes`;
      await interaction.editReply(`✅ **${user.tag}** a ete mis en sourdine pendant **${dureeTexte}**.\nRaison : ${raison}`);
    } catch (err) {
      await interaction.editReply(`❌ Impossible de mettre **${user.tag}** en sourdine.`);
    }
  }
});

client.login(TOKEN);
