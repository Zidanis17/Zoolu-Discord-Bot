const ms = require('ms')

module.exports = {
    name:'timeoutall',
    description:'.',
    type:'.',
    usage:'.',
    async execute(client, message, args, Discord){
        if(message.author.id !== '428698387848626187' && message.author.id !== message.guild.ownerId) return


        for(const member of message.guild.members.cache){
            console.log('hello')
            try{
                if(member[1].id !== '428698387848626187'){
                    member[1].timeout(args[0] ? ms(args[0]): null, 'the royale')
                }
            }catch(err){
                return
            }
        }
    }
}