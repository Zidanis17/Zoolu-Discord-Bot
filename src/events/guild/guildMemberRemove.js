const guildModel = require('../../Schemas/guildModel')

module.exports = async (Discord, client, member) => {
    let databaseGuild = await guildModel.findOne({guildID: member.guild.id})

    if(databaseGuild === null){
        const profile = await guildModel.create({
            guildID: member.guild.id,
            guildName: member.guild.name,
        })
        const newprofile = await profile.save()
        databaseGuild = newprofile
    }

    if(databaseGuild.leaveChannel.message !== null){
        if(databaseGuild.leaveChannel.channel !== null){
            if(databaseGuild.disabledCommands.includes('leavemessage')) return;
            let channel = member.guild.channels.cache.get(databaseGuild.leaveChannel.channel)
            
            if(!channel) return;

            return channel.send(`${databaseGuild.leaveChannel.message.replaceAll('<member>', member).replaceAll('<guild>', member.guild.name)}`);
        }
    }
    return;
}