const hugArray = require('../../arrays/hug.json')

module.exports = {
    name:'hug',
    description:'Hug your favourite user',
    type:'interaction',
    usage:'>hug <@mention>',
    execute(client, message, args, Discord){
        const randnum = Math.floor(Math.random() * hugArray.length)

        const embed = new Discord.EmbedBuilder()
            .setTitle('👐 Hug')
            .setDescription(`${message.mentions.users.first() ? `**${message.mentions.members.first().displayName}**, you've got a hug from **${message.member.displayName}**!` : `**${message.author.username}** is hugging someone!`}`)
            .setImage(hugArray[randnum])
            .setFooter({text:message.author.tag})

        return message.reply({embeds: [embed]})
    }
}