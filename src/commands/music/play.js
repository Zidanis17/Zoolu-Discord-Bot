const { QueryType, Track} = require('discord-player');
const { toColonNotation, toMilliseconds } = require('colon-notation');
const spotRegex = new RegExp(/^(https:\/\/open.spotify.com\/playlist\/|spotify:user:spotify:playlist:)([a-zA-Z0-9]+)(.*)$/);
const discordPlayer = require('discord-player');
const Queues = new Map();

module.exports = {
    name: 'play',
    description:'Plays a song of your choice',
    type:'music',
    usage:'>play <song link / song name>',
    aliases: ['p'],
    async execute(client, message, args, Discord){
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return message.reply('Join a voice channel to play music!')
        if(!args[0]) return message.reply('Please enter a query to search for')
        
        let queue = client.music.nodes.cache.get(message.guild.id);

        if(!queue){
            queue = await createQueue(client.music, message, voiceChannel);
        }

        

        if(spotRegex.test(args[0])){
            return addSpotTracks(client.music.spot, args[0], client.music ,queue, message);
        }

        if(queue != null){
            try {
                if (!queue.connection) await queue.connect(message.member.voice.channel);
            } catch(e){
                console.log(e);
                queue.delete();
                return await message.reply({ content: "Could not join your voice channel!"});
            }
        }
        

        const searchResult = await client.music
            .search(args.join(' '), {
                searchEngine:"youtube",
            })
            .catch(() => {
                console.log('Error Finding track');
            });
        searchResult.playlist ? queue.addTrack(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if(!queue.node.isPlaying()){
            try{
                await play1(queue);
            }catch(err){
                console.log(err);
                message.reply("Failed to get songs")
                
            }
        }
        
            

        return

        
    }
}

async function createQueue(player ,msg, voiceChannel){
    const queue = player.nodes.create(msg.guild, {
        metadata: {
         channel: msg.channel,
         client: msg.guild.members.me,
         requestedBy: msg.user,
        },
        selfDeaf: true,
        volume: 80,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 300000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 300000,
    });

    queue.textChannel = msg.channel
    return queue
}

async function addSpotTracks(spotSearcher, spotURL, player ,queue, msg){
    let tracks = [];
    const spotPlaylistId = spotRegex.exec(spotURL)[2];
    let playlistTracks = (await spotSearcher.getPlaylistTracks(spotPlaylistId)).body;

    if(!playlistTracks){
        if(queue){
            queue.delete();
        }
        return await msg.reply({ content: "Could not find the playlist!"});
    }

    let max = Math.ceil(playlistTracks.total / 100)
    for (let i = 0; i < max; i++) {
        const playlistTrackArr = (await spotSearcher.getPlaylistTracks(spotPlaylistId, {offset: 100 * i})).body.items;
        tracks.push(...playlistTrackArr);
      }
    let i = 0

    let tracksNames = await tracks.map(trackRaw => {
        const initialTrack = trackRaw.track;

        let data = {
            title: initialTrack.name ?? "",
            author: initialTrack.artists[0].name ?? "",
            url: initialTrack.external_urls.spotify ?? "",
            thumbnail: initialTrack.album.images[0].url ?? "",
            duration: toColonNotation(initialTrack.duration_ms) ?? "",
            requestedBy: msg.author,
            source: "spotify"
        };

        let track =  new discordPlayer.Track(player, data);
        return track;
    })

    let playlistRaw = await spotSearcher.getPlaylist(spotPlaylistId);
    msg.channel.send(`Added Playlist: \`\`${playlistRaw.body.name}\`\` with \`\` ${playlistRaw.body.tracks.total} \`\` songs`);
    queue.addTrack(tracksNames);
    if(queue != null){
        try {
            if (!queue.connection) await queue.connect(msg.member.voice.channel);
        } catch {
            queue.delete();
            return await msg.reply({ content: "Could not join your voice channel!"});
        }
    }
    if(!queue.node.isPlaying()){
        await play1(queue);
    }
    
}

async function play1(queue){
    try{
        if(queue.tracks.data.length> 0){
            return await queue.node.play();
        }
    }catch(e){
        if(queue.tracks.data.length > 0){
            queue.tracks.data.shift();
            return play1(queue);
        }
        else{ 
            queue.metadata.channel.send("Failed to get songs")
            throw(e);
        }
        
    }
}