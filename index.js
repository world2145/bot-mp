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

const APPEAL_LINK = 'https://discord.gg/RuTATTeRqb';

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot en ligne !');
}).listen(PORT, () => {
  console.log('Serveur HTTP actif sur le port ' + PORT);
});

const COULEURS = {
  mute:     0xf5a623,
  kick:     0xe67e22,
  ban_temp: 0xe74c3c,
  ban_def:  0x992d22,
};

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

  new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mettre en sourdine un membre')
    .addUserOption(function(option) {
      return option.setName('membre').setDescription('Le membre a mettre en sourdine').setRequired(true);
    })
    .addStringOption(function(option) {
      return option.setName('duree').setDescription('Duree de la sourdine').setRequired(true)
        .addChoices(
          { name: '60 secondes', value: '60' },
          { name: '5 minutes', value: '300' },
          { name: '10 minutes', value: '600' },
          { name: '1 heure', value: '3600' },
          { name: '1 jour', value: '86400' },
          { name: '1 semaine', value: '604800' }
        );
    })
    .addStringOption(function(option) {
      return option.setName('raison').setDescription('Raison de la sourdine').setRequired(false);
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('sanction')
    .setDescription('Annoncer une sanction (admin uniquement)')
    .addUserOption(function(option) {
      return option.setName('membre').setDescription('Le membre sanctionne').setRequired(true);
    })
    .addStringOption(function(option) {
      return option.setName('type').setDescription('Type de sanction').setRequired(true)
        .addChoices(
          { name: 'Mute', value: 'mute' },
          { name: 'Expulsion', value: 'kick' },
          { name: 'Ban temporaire', value: 'ban_temp' },
          { name: 'Ban definitif', value: 'ban_def' }
        );
    })
    .addStringOption(function(option) {
      return option.setName('raison').setDescription('Raison de la sanction').setRequired(true)
        .addChoices(
          { name: 'Spam', value: 'Spam' },
          { name: 'Insultes / Toxicite', value: 'Insultes / Toxicite' },
          { name: 'Publicite non autorisee', value: 'Publicite non autorisee' },
          { name: 'Contenu inapproprie', value: 'Contenu inapproprie' },
... (126lignes restantes)
