module.exports = {
    name: 'resume',
    description:'resume the song',
    type:'music',
    usage:'>resume',
    async execute(client, message, args, Discord){
        const queue = client.music.nodes.get(message.guild.id);
        if(!queue  && !queue.tracks.data.length <= 0) return(message.reply('No song, so no resume!'));
        queue.node.resume();
        message.react('▶️');
        return
    }
}