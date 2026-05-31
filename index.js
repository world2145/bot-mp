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

// ─── Serveur HTTP pour Render + UptimeRobot ───────────────────────────────────
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot en ligne !');
}).listen(PORT, () => {
  console.log(`Serveur HTTP actif sur le port ${PORT}`);
});
// ──────────────────────────────────────────────────────────────────────────────

const RAISONS_PREDEFINIES = [
  { name: '🔇 Spam', value: 'Spam' },
  { name: '🤬 Insultes / Toxicité', value: 'Insultes / Toxicité' },
  { name: '📢 Publicité non autorisée', value: 'Publicité non autorisée' },
  { name: '🔞 Contenu inapproprié', value: 'Contenu inapproprié' },
  { name: '🤖 Raid / Nuisance au serveur', value: 'Raid / Nuisance au serveur' },
  { name: '⚠️ Non-respect du règlement', value: 'Non-respect du règlement' },
  { name: '✏️ Raison personnalisée', value: 'CUSTOM' },
];

const commands = [
  // ── Commandes existantes ──────────────────────────────────────────────────
  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre et lui envoyer un MP')
    .addUserOption(option =>
      option.setName('membre').setDescription('Le membre a bannir').setRequired(true))
    .addStringOption(option =>
      option.setName('raison').setDescription('Raison du ban').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('expulser')
    .setDescription('Expulser un membre et lui envoyer un MP')
    .addUserOption(option =>
      option.setName('membre').setDescription('Le membre a expulser').setRequired(true))
    .addStringOption(option =>
      option.setName('raison').setDescription('Raison de l expulsion').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mettre en sourdine un membre')
    .addUserOption(option =>
      option.setName('membre').setDescription('Le membre a mettre en sourdine').setRequired(true))
    .addStringOption(option =>
      option.setName('duree').setDescription('Duree de la sourdine').setRequired(true)
        .addChoices(
          { name: '60 secondes', value: '60' },
          { name: '5 minutes', value: '300' },
          { name: '10 minutes', value: '600' },
          { name: '1 heure', value: '3600' },
          { name: '1 jour', value: '86400' },
          { name: '1 semaine', value: '604800' },
        ))
    .addStringOption(option =>
      option.setName('raison').setDescription('Raison de la sourdine').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .toJSON(),

  // ── /sanction : annonce uniquement, rien d'appliqué ──────────────────────
  new SlashCommandBuilder()
    .setName('sanction')
    .setDescription('Annoncer une sanction (admin uniquement) — aucune action réelle')
    .addUserOption(option =>
      option.setName('membre').setDescription('Le membre sanctionné').setRequired(true))
    .addStringOption(option =>
      option.setName('type').setDescription('Type de sanction').setRequired(true)
        .addChoices(
          { name: '🔇 Mute', value: 'mute' },
          { name: '👢 Expulsion', value: 'kick' },
          { name: '🔨 Ban temporaire', value: 'ban_temp' },
          { name: '⛔ Ban définitif', value: 'ban_def' },
        ))
    .addStringOption(option =>
      option.setName('raison').setDescription('Raison de la sanction').setRequired(true)
        .addChoices(...RAISONS_PREDEFINIES))
    .addStringOption(option =>
      option.setName('raison_custom')
        .setDescription('Raison personnalisée (si "Raison personnalisée" choisi)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('duree')
... (147lignes restantes)
