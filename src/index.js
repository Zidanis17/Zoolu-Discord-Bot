const Discord = require('discord.js');
const fs = require('fs');
const spotApi = require('spotify-web-api-node');
const classes = require('./classes');
const discordPlayer = require('discord-player');
const mongoose = require('mongoose');
require('dotenv').config()
const Queues = new Map();


const client = new Discord.Client({
    resetTimeOffset: 0, 
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildIntegrations,
    ],
    partials: [Discord.Partials.Channel, Discord.Partials.GuildMember, Discord.Partials.Message, Discord.Partials.User, Discord.Partials.Reaction]
});

client.music = new discordPlayer.Player(client);
client.music.extractors.loadDefault();

client.music.spot = new spotApi({
    clientId: '4c8d7a2d578842829f185ef6f1580e8c',
    clientSecret: '57daa21c5ab748abaf4c8ae4772e6f09',
});

connectToSpotify();

function connectToSpotify(){
    client.music.spot.clientCredentialsGrant().then(res => {
        client.music.spot.setAccessToken(res.body.access_token)
    })

    setTimeout(() => {  
        connectToSpotify()
    }, 359000)
}

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.games = new classes.Games(client);

process.on('unhandledRejection', error => {
	return console.log('Unhandled promise rejection:', error);
});

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});

mongoose.connect(process.env.MONGOSRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to Database!')
}).catch((err) => {
    return console.log(err)
})

client.music.events.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
client.music.events.on("playerError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

client.music.events.on("playerStart", (queue, track) => {
    queue.metadata.channel.send(`🎶 | Started playing: **${track.title}** in **${queue.metadata.channel.name}**!`);
});

client.music.events.on("audioTrackAdd", (queue, track) => {
    queue.metadata.channel.send(`🎶 | Track **${track.title}** queued!`);
});

client.music.events.on("disconnect", (queue) => {
    queue.metadata.channel.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
});

client.music.events.on("emptyChannel", (queue) => {
    queue.metadata.channel.send("❌ | Nobody is in the voice channel, leaving...");
});

client.music.events.on("emptyQueue", (queue) => {
    queue.metadata.channel.send("✅ | Queue finished!");
});

client.music.events.on('error', (queue, error) => {
    console.log(`General player error event: ${error.message}`);
    console.log(error);
});

client.music.events.on('playerError', (queue, error) => {
    console.log(`Player error event: ${error.message}`);
    console.log(error);
});

client.login(process.env.DisToken);