const DiscordPages = require("discord-pages");

module.exports = {
    name:'queue',
    description:'Display the queue',
    type:'music',
    usage:'>queue',
    async execute(client, message, args, Discord){
        const queue = client.music.nodes.get(message.guild.id);
        if(!queue && !queue.tracks.data.length <= 0) return message.reply('No queue, so no displaying it');

        let size = Math.trunc(queue.tracks.data.length / 20) + 1;

        let i = 1;
        let m = 0;
        let o = 0;
        let t = 20;
        const pages = [];

        for(; m < size ;){
            const playlistPages = new Discord.EmbedBuilder()
                .setTitle(`${message.guild.name} Queue`)
                .setDescription(`NOW PLAYING: [${queue.currentTrack.title}](${queue.currentTrack.url})\n` + queue.tracks.data.slice(o, t).map(song => `${i++}- [${song !== null ? song.title : `Undefined Song`}](${song !== null ? song.url: `Undefined URL`}) | \`${song !== null ? song.duration : `00:00`}\``).join('\n'))
            pages.push(playlistPages)
            t += 20
            o += 20
            m++ 
        }

        if(pages.length < 2){
            let i = 1
            const embed = new Discord.EmbedBuilder()
                .setTitle(`${message.guild.name} Queue`)
                .setDescription(`NOW PLAYING: [${queue.currentTrack.title}](${queue.currentTrack.url})\n` + queue.tracks.data.slice(0, 20).map(song => `${i++}- [${song !== null ? song.title : `Undefined Song`}](${song !== null ? song.url: `Undefined URL`}) | \`${song !== null ? song.duration : `00:00`}\``).join('\n'))

            return message.reply({embeds: [embed]})
        }else{
            const pagesEmbed = new DiscordPages({
                pages: pages,
                channel: message.channel,
                duration: 600000
            })
        
            pagesEmbed.createPages()
        }
        return
    }
}