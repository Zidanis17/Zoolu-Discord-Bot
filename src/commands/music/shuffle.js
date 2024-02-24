module.exports = {
    name:'shuffle',
    description:'Shuffles a queue',
    type:'music',
    usage:'>shuffle',
    execute(client, message, args, Discord){
        let queue = client.music.nodes.get(message.guild.id);
        if(!queue  && !queue.tracks.data.length <= 0) return message.reply('No queue, so no shuffle');
        
        queue.enableShuffle(false);

        try{
            let queue2 = client.commands.get("queue");
            queue2.execute(client, message, args, Discord);
        }catch(err){
            console.log(err)
        }
        return message.react('🔀');
    }
}