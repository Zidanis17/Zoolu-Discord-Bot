const {QueueRepeatMode} = require('discord-player')
module.exports = {
    name: 'loop',
    description:'Loops a song',
    type:'music',
    usage:'>loop',
    async execute(client, message, args, Discord){
        const queue = client.music.nodes.get(message.guild.id)
        if(!queue  && !queue.tracks.data.length <= 0) return(message.reply('No song, so no loop!'))
        

        console.log(queue.repeatMode)
        let mode = (queue.repeatMode + 1) > 2 ? 0 : queue.repeatMode + 1 
        switch(mode) {
            case 0:
                mode = "Off";
                queue.setRepeatMode(QueueRepeatMode.OFF);
                break;
            case 1:
                mode = "Repeat Song";
                queue.setRepeatMode(QueueRepeatMode.TRACK);
                break;
            case 2:
                mode = "Repeat Queue";
                queue.setRepeatMode(QueueRepeatMode.QUEUE);
                break;
        }
        message.reply("Set repeat mode to `" + mode + "`");
        return
    }
}