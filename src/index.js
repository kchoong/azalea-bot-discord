const fs = require('node:fs');
const path = require('node:path');
const {
  ActivityType,
  Client,
  Collection,
  GatewayIntentBits,
  PresenceUpdateStatus,
} = require('discord.js');
const {Player} = require('discord-player');

const dotenv = require('dotenv');
dotenv.config();

// Create a new client instance
const client = new Client({intents: [GatewayIntentBits.Guilds, 'GuildVoiceStates']});

// this is the entrypoint for discord-player based application
const player = new Player(client);
player.extractors
  .loadDefault((ext) => ['YouTubeExtractor', 'SpotifyExtractor', 'LyricsExtractor'].includes(ext))
  .then((r) => {
    // Add discord-player events (see the documentation for more events)
    player.events.on('playerStart', (queue, track) => {
      client.user.setActivity(`🎧 ${track.title}`, {type: ActivityType.Custom});
    });
    player.events.on('emptyQueue', (queue) => {
      client.user.setActivity('🌸', {type: ActivityType.Custom});
    });
  });

// Load bot commands
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Load bot events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);
