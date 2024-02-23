const DiscordPages = require("discord-pages");
const rankModel = require('../../Schemas/rankModel');

module.exports = {
    name:'leaderboard',
    description:'View the highest people in terms of XP',
    type:'xp',
    usage:'>leaderboard',
    async execute(client, message, args, Discord){
        let allMemberProf = await rankModel.find({guildID: message.guild.id}).sort({xpTotal: -1});

        if(allMemberProf === null) return message.reply('Sorry this guild doesn\'t have any data yet');

        const size = Math.trunc(allMemberProf.length / 5) + 1;

        let m = 0
        let o = 0
        let t = 5
        const pages = [];

        for(let i = 0; m < size ; i++){
            const playlistPages = new Discord.EmbedBuilder()
                .setTitle(`${message.guild.name} LeaderBoard`)
                .setThumbnail('https://cdn.discordapp.com/attachments/930817105832603668/952375023027503124/XP.png')

                for(; o < t ; o++){
                    if(allMemberProf[o] !== undefined){
                        playlistPages.addField(`${o + 1}- ${allMemberProf[o].memberName}` , `Level: ${allMemberProf[o].level} - Xp: ${allMemberProf[o].xp} `);
                    }
                }
            pages.push(playlistPages);
            t += 5
            m++
        }

        if(pages.length < 2){
            const embed = new Discord.EmbedBuilder()
                .setTitle(`${message.guild.name} LeaderBoard`)
                .setThumbnail('https://cdn.discordapp.com/attachments/930817105832603668/952375023027503124/XP.png')
                for(let j = 0; allMemberProf[j] !== undefined; j++){
                    embed.addField(`${j + 1}- ${allMemberProf[j].memberName}` , `Level: ${allMemberProf[j].level} - Xp: ${allMemberProf[j].xp} `)
                }
            
            return message.channel.send({embeds: [embed]})
        }else{
            const pagesEmbed = new DiscordPages({
                pages: pages,
                channel: message.channel,
                duration: 600000
            })
        
            return pagesEmbed.createPages()
        }
    }
}