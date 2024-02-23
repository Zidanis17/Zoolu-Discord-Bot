const canvacord = require('canvacord')

module.exports = {
    name:'trigger',
    description:'Adds trigger effect to pfp',
    type:'fun',
    usage:'>trigger <mention>(optional)',
    async execute(client, message, args, Discord){
        let member = message.mentions.members.first() || message.member
        let profilePic = member.displayAvatarURL({dynamic: true, format: 'png', size: 1024})
        
        canvacord.Canvacord.trigger(profilePic).then(dataBuffer => {
            image = new Discord.MessageAttachment(dataBuffer, "trigger.png");
            return message.channel.send({files: [image]})
        })
                        

        return
    }
}