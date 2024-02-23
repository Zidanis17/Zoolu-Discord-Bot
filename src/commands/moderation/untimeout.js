const functions = require('../../functions/src/functions')
const ms = require('ms')


module.exports = {
    name:'untimeout',
    description:'Remove the timeout from a specific user',
    type:'moderation',
    usage:'>untimeout <@member>',
    permissions: ['ModerateMembers'],
    cooldown: 30,
    async execute(client, message, args, Discord){
        if(!message.mentions.members.first()) return message.reply('Please mention a member to timeout')
        
        const MemToUnTimeout = message.mentions.members.first()
        const unTimeOutingMem = message.member
        const bot = message.guild.members.me

        let checked = await functions.checkIfManageable(unTimeOutingMem, MemToUnTimeout, bot)

        if(checked === 'memRoleLower'){
            return message.reply('Your highest role is lower than the role of the member you\'re trying to untimeout')
        }

        if(checked === 'botRoleLower'){
            return message.reply('The bot can\'t moderate this user because he has a higher position than me or he is the owner')
        }

        if(checked === true){
            MemToUnTimeout.timeout(null)
            return message.react('✅')
        }
    }
}