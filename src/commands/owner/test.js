const fetch = require('node-fetch');
const ytsearch = require('yt-search');
const { QueryType, Track, Playlist } = require('discord-player');
const { toColonNotation, toMilliseconds } = require('colon-notation');
const spotRegex = new RegExp(/^(https:\/\/open.spotify.com\/playlist\/|spotify:user:spotify:playlist:)([a-zA-Z0-9]+)(.*)$/)

module.exports = {
    name:'test',
    description:'test',
    type:'owner',
    usage:'>test',
    async execute(client, message, args, Discord){ 
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return message.reply('Join a voice channel to play music!')
        if(!args[0]) return message.reply('Please enter a query to search for')
        
        let queue = client.music.getQueue(message.guild.id)
   
        if(!queue){
            queue = await createQueue(client.music, message, voiceChannel)
        }

        if(spotRegex.test(args[0])){
            return addSpotTracks(client.music.spot, args[0], client.music ,queue, message)
        }


        const searchResult = await client.music
            .search(args.join(' '), {
                requestedBy: message.author,
                searchEngine: QueryType.AUTO
            })
            .catch(() => {
                console.log('Error Finding track');
            });

        try {
            if (!queue.connection) await queue.connect(voiceChannel);
        } catch {
            queue.destroy();
            return await msg.reply({ content: "Could not join your voice channel!"});
        }


        if (!searchResult || !searchResult.tracks.length) return void message.channel.send({ content: 'No results were found!' });

        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        await queue.play()
        await queue.skip()

        return

        
    }
}

async function createQueue(player ,msg, voiceChannel){
    let queue = player.createQueue(msg.member.guild, {
        ytdlOptions: {
            filter: 'audioonly',
            highWaterMark: 1 << 30,
            dlChunkSize: 0,
        },
        metadata: {
            channel: voiceChannel
        }
    });
    return queue
}

async function addSpotTracks(spotSearcher, spotURL, player ,queue, msg){
    let tracks = []
    const spotPlaylistId = spotRegex.exec(spotURL)[2]
    let playlistTracks = (await spotSearcher.getPlaylistTracks(spotPlaylistId)).body

    if(!playlistTracks){
        queue.destroy();
        return await msg.reply({ content: "Could not find the playlist!"});
    }

    let max = Math.ceil(playlistTracks.total / 100)
    for (let i = 0; i < max; i++) {
        const playlistTrackArr = (await spotSearcher.getPlaylistTracks(spotPlaylistId, {offset: 100 * i})).body.items;
        tracks.push(...playlistTrackArr);
      }

    let tracksNames = await tracks.map(trackRaw => {
        const initialTrack = trackRaw.track
        let data = {
            title: initialTrack.name ?? "",
            author: initialTrack.artists[0].external_urls.spotify ?? "",
            url: initialTrack.external_urls.spotify ?? "",
            thumbnail: initialTrack.album.images[0].url ?? "",
            duration: toColonNotation(initialTrack.duration_ms) ?? "",
            requestedBy: msg.author,
            source: "spotify"
        };

        let track = new Track(player, data);
        return track
    })

    try {
        if (!queue.connection) await queue.connect(msg.member.voice.channel);
    } catch {
        queue.destroy();
        return await msg.reply({ content: "Could not join your voice channel!"});
    }

    await queue.addTracks(tracksNames)
    queue.play()
}