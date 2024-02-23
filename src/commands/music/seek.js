module.exports = {
    name: 'seek',
    description:'Seek to a point in the song',
    type:'music',
    usage:'>seek <time in seconds>',
    async execute(client, message, args, Discord){
        const queue = client.music.nodes.get(message.guild.id);
        if(!queue  && !queue.tracks.data.length <= 0) return(message.reply('No song, so no seek!'))
        if(!args[0]) return message.channel.send('Send the number in seconds you want to seek to')
        if(isNaN(args[0])) return message.channel.send('The value inserted isn\'t a number')

        queue.node.seek(Number(args[0]) * 1000)
        return message.react('↪️')
    }
}