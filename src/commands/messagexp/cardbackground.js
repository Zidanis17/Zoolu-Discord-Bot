const regex = new RegExp(/\.(jpeg|jpg|gif|png)$/)
const rankModel = require('../../Schemas/rankModel')

module.exports = {
    name:'cardbackground',
    description:'Set the card\'s background',
    type:'xp',
    usage:'>cardbackground <attachment/default>',
    async execute(client, message, args, Discord){
        let member = message.member
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

        if(!args[0]){
            if(!message.attachments.first()) return message.reply('Please attach an image')
            if(message.attachments.first().contentType.split('/')[0] !== 'image') return message.reply('Please attach an image')
            if(message.attachments.first().url.endsWith('webp')) return message.reply('We don\'t support webp formats')

            await rankModel.updateMany({memberID: member.user.id}, {$set: {background: message.attachments.first().url}}).catch(() => message.reply("Error updating the background"))

            return message.reply('Background Updated')
        }else{
            if(args[0] === 'default'){
                await rankModel.updateMany({memberID: member.user.id}, {$set: {background: 'default'}}).catch(err => console.log(err))

                return message.reply('Background Updated')
            }else{
                return message.reply('Please attach an image')
            }
        }
        return
    }
}
