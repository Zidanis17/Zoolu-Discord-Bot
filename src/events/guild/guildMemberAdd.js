const rankModel = require('../../Schemas/rankModel')
const guildModel = require('../../Schemas/guildModel')

module.exports = async (Discord, client, member) => {   
    let memberProf = await rankModel.findOne({memberID: member.user.id, guildID: member.guild.id})
    let databaseGuild = await guildModel.findOne({guildID: member.guild.id})

    if(databaseGuild === null){
        const profile = await guildModel.create({
            guildID: member.guild.id,
            guildName: member.guild.name,
        })
        const newprofile = await profile.save()
        databaseGuild = newprofile
    }

    if(memberProf === null){
        let profile = await rankModel.create({
            memberID: member.id,
            memberName: member.displayName,
            guildID: member.guild.id,
            guildName: member.guild.name
        })
        memberProf = await profile.save()
    }

    if(databaseGuild.welcomeChannel.message !== null){
        if(databaseGuild.welcomeChannel.channel !== null){
            if(databaseGuild.disabledCommands.includes('welcomemessage')) return;
            let channel = member.guild.channels.cache.get(databaseGuild.welcomeChannel.channel)
            
            if(!channel) return;

            return channel.send(`${databaseGuild.welcomeChannel.message.replaceAll('<member>', member).replaceAll('<guild>', member.guild.name)}`);
        }
    }
    return;
}