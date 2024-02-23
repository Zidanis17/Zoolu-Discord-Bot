module.exports = {
    name: 'pause',
    description:'Pauses a song',
    type:'music',
    usage:'>pause',
    async execute(client, message, args, Discord){
        const queue = client.music.nodes.get(message.guild.id);
        if(!queue  && !queue.tracks.data.length <= 0) return(message.reply('No queue, so no pause!'));
        queue.node.pause(true);
        message.react('⏸');
        return;
    }
}