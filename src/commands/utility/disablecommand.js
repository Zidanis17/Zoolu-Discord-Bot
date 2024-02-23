const guildModel = require('../../Schemas/guildModel')

module.exports = {
    name:'disablecommand',
    description:'Disable a command from the bot',
    type:'utility',
    usage:'>disable <command name/alias>',
    permissions: ['Administrator'],
    async execute(client, message, args, Discord){
        if(!args[0]) return message.reply(`Please enter the name of the command`) 

        let profileCreated
        const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(a => a.aliases && a.aliases.includes(args[0].toLowerCase()))

        if(!command) return message.reply(`Command not found`)
        if(command && command.type === 'owner') return message.reply(`You can't use those anyways`)

        profileCreated = await guildModel.findOne({guildID: message.guild.id})

        if(profileCreated === null){
            const profile = await guildModel.create({
                guildID: message.guild.id,
                guildName: message.guild.name,
            })
            profileCreated = await profile.save()
        }

        if(profileCreated.disabledCommands.includes(command.name)) return message.reply(`This command is already disabled`) 

        await profileCreated.updateOne({$push: {disabledCommands: command.name}}).catch(err => console.log(err))

        return message.reply(`${command.name.toUpperCase()} command is now disabled`)
    }
}