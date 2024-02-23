const blackListModels = require('../../Schemas/blacklistmodels')
const regex = new RegExp(/(\d+(d|h|m))/,'i')
const ms = require('ms')

module.exports = {
    name:'blacklist',
    description:'Stop a member from using the bot',
    type:'owner',
    usage:'>blacklist <@mention> <duration> <reason>',
    async execute(client, message, args, Discord){
        let mention = message.mentions.users.first()
        let mongoEntry
        let reason
        let time = null

        if(message.author.id !== '428698387848626187') return
        if(!mention) return message.reply('Please mention someone to blacklist')
        if(regex.test(args[1])) time = regex.exec(args[1])[0];

        mongoEntry = await blackListModels.findOne({ userID: mention.id})

        if(mongoEntry !== null) return message.reply('This user is already blacklisted')

        reason = args[2] ? args[2] : 'none'

        const profile = await blackListModels.create({
            userID: mention.id,
            duration: time !== null? Date.now() + ms(regex.exec(args[1])[0]): 'none',
            reason: reason
        })
        await profile.save()

        return message.reply(`Blacklisted **${mention.username}** ${time === null? '': `for **${args[1]}**`} ${reason !== 'none' ? `for **${reason}**`: ''}`)
    }
}