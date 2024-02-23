const functions = require('../../functions/src/functions')
const regex = new RegExp(/(\d+(d|h|m))/,'i')
const ms = require('ms')

module.exports = {
    name:'timeout',
    description:'timeout a specific user',
    type:'moderation',
    usage:'>timeout <@member> <duration(eg. 1d/1h/1s)>(below 30 days) <reason>(optional)',
    permissions: ['ModerateMembers'],
    cooldown: 1,
    async execute(client, message, args, Discord){
        if(!message.mentions.members.first()) return message.reply('Please mention a member to timeout')
        
        const MemToTimeout = message.mentions.members.first()
        const timeOutingMem = message.member
        const bot = message.guild.members.me
        let time

        let checked = await functions.checkIfManageable(timeOutingMem, MemToTimeout, bot)

        if(checked === 'memRoleLower'){
            return message.reply('Your highest role is lower than the role of the member you\'re trying to timeout')
        }

        if(checked === 'botRoleLower'){
            return message.reply('The bot can\'t moderate this user because he has a higher position than me or he is the owner')
        }

        if(!args[1]) return message.reply('Please specify a duration for the timeout')
        if(!regex.test(args[1])) return message.reply('Please specify a valid duration for the timeout')

        time = regex.exec(args[1])[0]

        if(ms(time) > 2592000000) return message.reply('You cannot timeout a user for more than a month')

        if(checked === true){
            MemToTimeout.timeout(ms(time), args[2] ? args.slice(2).join(' ') : '')
            return message.reply(`Timed out **${MemToTimeout.user.username}** for ${ms(ms(time), {long: true})} ${args[2] ? `with the reason: **${args.slice(2).join(' ')}**` : ''}`)
        }
    }
}