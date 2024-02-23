module.exports = {
    name: 'banner',
    description:'Shows you the banner',
    type:'utility',
    usage:'>banner <@mention>(optional)',
    aliases: ['b'],
    async execute(client, message, args, Discord){
        const member = message.mentions.members.first() || message.member

        if(!(await member.user.fetch(['force'])).banner) return message.reply(`This user doesn't have a banner`)
        const banner =(await member.user.fetch(['force'])).banner

        const embed = new Discord.EmbedBuilder()
            .setTitle(`🖼️${member.user.username}`)
            .setImage(`https://cdn.discordapp.com/banners/${member.user.id}/${banner}.gif?size=1024`)
            .setColor(member.displayColor)

        return message.reply({embeds: [embed]})
    }
}