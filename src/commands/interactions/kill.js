const killArray = require('../../arrays/kill.json')

module.exports = {
    name:'kill',
    description:'Kill someone irl maybe',
    type:'interaction',
    usage:'>kill <@mention>',
    execute(client, message, args, Discord){
        if(!message.mentions.users.first()) return message.reply('You need to mention a member to kill, fam')

        const randNum = Math.floor(Math.random() * killArray.length)

        let phrase = killArray[randNum]

        if(phrase.includes('$author')){
            phrase = phrase.replace(/\$author/g, `${message.author}`)
        }

        if(phrase.includes('$mention')){
            phrase = phrase.replace(/\$mention/g, `${message.mentions.users.first()}`)
        }

        return message.channel.send(phrase)
    }
}