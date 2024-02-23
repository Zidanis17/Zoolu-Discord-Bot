const punchArray = require('../../arrays/punch.json')

module.exports = {
    name:'punch',
    description:'punch a user',
    type:'interaction',
    usage:'>punch <@mention>',
    execute(client, message, args, Discord){
        const randnum = Math.floor(Math.random() * punchArray.length)

        const embed = new Discord.EmbedBuilder()
            .setTitle('🤜 Punch')
            .setDescription(`${message.mentions.users.first() ? `**${message.mentions.members.first().displayName}**, you're punched from **${message.member.displayName}**!` : `**${message.author.username}** is punching someone!`}`)
            .setImage(punchArray[randnum])
            .setFooter({text:message.author.tag})

        return message.reply({embeds: [embed]})
    }
}