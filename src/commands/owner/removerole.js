module.exports = {
    name:'removerole',
    description:'.',
    type:'.',
    usage:'.',
    execute(client, message, args, Discord){
        if(message.author.id !== '428698387848626187') return

        const role = message.mentions.roles.first()

        message.mentions.members.first().roles.remove([role])
    }
}