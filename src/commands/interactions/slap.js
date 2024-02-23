const slapArray = require('../../arrays/slap.json')

module.exports = {
    name:'slap',
    description:'slap your favourite user',
    type:'interaction',
    usage:'>slap <@mention>',
    execute(client, message, args, Discord){
        const randnum = Math.floor(Math.random() * slapArray.length)

        const embed = new Discord.EmbedBuilder()
            .setTitle('👐 Slap')
            .setDescription(`${message.mentions.users.first() ? `**${message.mentions.members.first().displayName}**, you're being slapped from **${message.member.displayName}**!` : `**${message.author.username}** is slapging someone!`}`)
            .setImage(slapArray[randnum])
            .setFooter({text:message.author.tag})

        return message.reply({embeds: [embed]})
    }
}