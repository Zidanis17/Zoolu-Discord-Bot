module.exports = {
    name: 'skip',
    description:'Skips a song',
    type:'music',
    usage:'>skip',
    async execute(client, message, args, Discord){
        const queue = client.music.nodes.get(message.guild.id);
        if(!queue  && !queue.tracks.data.length <= 0) return message.reply('No queue, so no skip');
        queue.node.skip();
        message.react('▶️');
    }
}