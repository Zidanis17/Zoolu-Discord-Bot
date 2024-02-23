module.exports = {
    name: 'clear',
    description:'Clears last set of messages',
    type:'utility',
    usage:'>clear <(0 <number < 100)>',
    permissions: ['ManageMessages'],
    async execute(client, message, args, Discord){
        if(!args[0]) return message.reply('You need to write the number of messages')
        if(isNaN(parseInt(args[0]))) return message.reply('You need to write a number not letters')
        if(args[0] > 100) return message.reply('You can\'t purge more than 100 messages')
        if(args[0] < 1) return message.reply(`You can't 0 or less messages`)

        message.channel.messages.fetch({limit: parseInt(args[0])})
        .then((msgs) => {
            message.channel.bulkDelete(msgs, ['filterOld'])
        }).catch(err => {
            return console.log(err)
        })
        return
    }
}