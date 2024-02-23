const guildModel = require('../../Schemas/guildModel')

module.exports = {
    name:'welcomemessage',
    description:'A feature to send a message when a new member joins the server',
    type:'utility',
    usage:'>welcomeMessage <Message to be sent>(Command must be used is the channel you want the messages to be sent it)(use <member> to mention the member, <guild> to type the server name), Type null to disable',
    permissions: ['ManageMessages'],
    async execute(client, message, args, Discord){
        let databaseGuild = await guildModel.findOne({guildID: message.guild.id})

        if(databaseGuild === null){
            const profile = await guildModel.create({
                guildID: message.guild.id,
                guildName: message.guild.name,
            })
            const newprofile = await profile.save()
            databaseGuild = newprofile
        }

        if(!args[0]) return message.reply('Please enter the message to be sent')
        let welcomeMessage = args.join(' ')

        if(welcomeMessage === 'null'){
            await databaseGuild.updateOne({$set: {'welcomeChannel.message': null, 'welcomeChannel.channel': null}})
        }else{
            await databaseGuild.updateOne({$set: {'welcomeChannel.message': welcomeMessage, 'welcomeChannel.channel': message.channel.id}})
        }
        return message.reply('Welcome Message Updated')
    }
}