module.exports = {
    name: 'stop',
    description:'Stops the song',
    type:'music',
    usage:'>stop',
    aliases: ['leave'],
    async execute(client, message, args, Discord){
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return message.reply('Join a voice channel to play music!');
        const queue = client.music.nodes.get(message.guild.id);
        if(!queue && !queue.tracks.data.length <= 0) return(message.reply('No song, so no stop!'));

        queue.delete();
        queue.node.stop();
        return message.react('🛑');
    }
}