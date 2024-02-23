const blackListModels = require('../../Schemas/blacklistmodels')

module.exports = {
    name:'whitelist',
    description:'Whitelist a previously blacklisted member',
    type:'owner',
    usage:'>whitelist <@mention>',
    async execute(client, message, args, Discord){
        let mention = message.mentions.users.first()
        let mongoEntry

        if(message.author.id !== '428698387848626187') return
        if(!mention) return message.reply('Please mention someone to whitelist')

        mongoEntry = await blackListModels.findOne({ userID: mention.id})

        if(mongoEntry === null) return message.reply('This user is already Whitelisted')

        await mongoEntry.remove()

        return message.reply(`Whitelisted **${mention.username}**`)
    }
}