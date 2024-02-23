module.exports = {
    name:'shuffle',
    description:'Shuffles a queue',
    type:'music',
    usage:'>shuffle',
    execute(client, message, args, Discord){
        const queue = client.music.nodes.get(message.guild.id);
        if(!queue  && !queue.tracks.data.length <= 0) return message.reply('No queue, so no shuffle');
        
        for(i = 0; i < queue.tracks.data.length; i++){
            let random = Math.random() * queue.tracks.data.length;
            let temp = queue.tracks.data[random];
            queue.tracks.data[random] = queue.tracks.data[i];
            queue.tracks.data[i] = temp;
        }


        return message.react('🔀')
    }
}