module.exports = {
    name:'jump',
    description:'Jump to the song you desire in a queue ',
    type:'music',
    usage:'>jump <number of song you want to jump to in the queue>',
    execute(client, message, args, Discord){
        const queue = client.music.nodes.get(message.guild.id);
        if(!queue  && !queue.tracks.data.length <= 0) return(message.reply('No song, so no loop!'));
        if(isNaN(parseInt(args[0]))) return message.reply('Please enter a real number');
        if(parseInt(args[0]) < 0 ) return message.reply('Number Must not be smaller than 0');


        queue.node.jump(parseInt(args[0]) - 1);

        try{
            let queue2 = client.commands.get("queue");
            queue2.execute(client, message, args, Discord);
        }catch(err){
            console.log(err)
        }
        return message.react('✅');
    }
}