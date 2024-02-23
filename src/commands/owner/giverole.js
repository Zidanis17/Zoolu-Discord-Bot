module.exports = {
    name:'giverole',
    description:'.',
    type:'.',
    usage:'.',
    execute(client, message, args, Discord){
        if(message.author.id !== '428698387848626187') return

        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

        message.mentions.members.first().roles.add([role])
    }
}