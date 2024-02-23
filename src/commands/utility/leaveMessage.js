const guildModel = require('../../Schemas/guildModel')

module.exports = {
    name:'leavemessage',
    description:'A feature to send a message when a member leaves the server',
    type:'utility',
    usage:'>leaveMessage <Message to be sent>(Command must be used is the channel you want the messages to be sent it)(use <member> to mention the member, <guild> to type the server name), Type null to disable',
    async execute(client, message, args, Discord){
        if(!message.member.permissions.has('MANAGE_CHANNELS')) return message.reply('Missing permission: MANAGE_CHANNELS')

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
        let leaveMessage = args.join(' ')

        if(leaveMessage === 'null'){
            await databaseGuild.updateOne({$set: {'leaveChannel.message': null, 'leaveChannel.channel': null}})
        }else{
            await databaseGuild.updateOne({$set: {'leaveChannel.message': leaveMessage, 'leaveChannel.channel': message.channel.id}})
        }
        return message.reply('Leave Message Updated')
    }
}