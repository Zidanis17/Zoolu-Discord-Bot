const canvacord = require('canvacord')
const rankModel = require('../../Schemas/rankModel')

module.exports = {
    name:'rank',
    description:'Shows the rank of the user',
    type:'xp',
    usage:'>rank <@mention(Optional)>',
    async execute(client, message, args, Discord){
        let member = message.mentions.members.first() || message.member
        let memberProf = await rankModel.findOne({memberID: member.user.id, guildID: message.guild.id})

        if(memberProf === null){
            let profile = await rankModel.create({
                memberID: member.id,
                memberName: member.displayName,
                guildID: message.guild.id,
                guildName: message.guild.name
            })
            memberProf = await profile.save()
        }

        let allGuildProfIds = await rankModel.find({guildID: message.guild.id}).sort({xpTotal: -1})
        let rank = allGuildProfIds.map(mem => mem.memberID).indexOf(member.user.id)

        let card = new canvacord.Rank()
            .setAvatar(member.displayAvatarURL({dynamic: false,format: 'png'}))
            .setUsername(memberProf.memberName)
            .setCurrentXP(memberProf.xp)
            .setRequiredXP(memberProf.level * 500)
            .setRank(rank + 1)
            .setLevel(memberProf.level)
            .setDiscriminator(member.user.discriminator)
            .setStatus(member.presence === null ? 'offline' : member.presence.status)

        if(memberProf.background !== 'default'){
            card.setBackground('IMAGE', memberProf.background)
            card.setOverlay('#ffffff', 2, false)
        }

        let photo
        const data = await card.build()
            .then(dataBuffer => {
                photo = new Discord.AttachmentBuilder(dataBuffer, {name:"rank.png"});
            })
        

        return message.reply({files: [photo]})
    }
}