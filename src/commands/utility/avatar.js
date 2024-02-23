module.exports = {
    name: 'avatar',
    description:'Shows you the pfp',
    aliases: ['a', 'av'],
    type:'utility',
    usage:'>avatar <@mention>(optional)',
    async execute(client, message, args, Discord){
        const member = message.mentions.members.first() || message.member

        const embed = new Discord.EmbedBuilder()
            .setTitle(`🖼️${member.user.username}`)
            .setImage(`${member.user.displayAvatarURL({dynamic: true, format: 'png', size: 1024})}`)
            .setColor(member.displayColor)

        return message.reply({embeds: [embed]})
    }
}