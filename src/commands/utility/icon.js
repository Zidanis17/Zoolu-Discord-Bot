module.exports = {
    name:'icon',
    description:'Display the server icon',
    type:'utility',
    usage:'>icon',
    execute(client, message, args, Discord){
        const embed = new Discord.EmbedBuilder()
            .setTitle(`🖼️${message.guild.name}'s Icon`)
            .setImage(`${message.guild.iconURL({dynamic: true, format: 'png', size: 1024})})}`)

        return message.reply({embeds: [embed]})
    }
}