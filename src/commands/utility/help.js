module.exports = {
    name:'help',
    description:'Shows all commands',
    type:'utility',
    async execute(client, message, args, Discord, cmd){
        const command = client.commands.get(args[0]) || client.commands.find(a => a.aliases && a.aliases.includes(args[0]))

        if(!command || command.name === 'help'){
            const commands = client.commands.map(cmd => cmd).sort()
            let musicCmds = []
            let utilityCmds = []
            let interactionCmds = []
            let gamesCmds = []
            let funCmds = []
            let xpCmds = []
            
            for(const cmd of commands){
                if(cmd.type === 'music'){
                    musicCmds.push(cmd.name)
                }

                if(cmd.type === 'utility'){
                    utilityCmds.push(cmd.name)
                }
                
                if(cmd.type === 'interaction'){
                    interactionCmds.push(cmd.name)
                }

                if(cmd.type === 'games'){
                    gamesCmds.push(cmd.name)
                }

                if(cmd.type === 'fun'){
                    funCmds.push(cmd.name)
                }

                if(cmd.type === 'xp'){
                    xpCmds.push(cmd.name)
                }
            }

            const embed = new Discord.EmbedBuilder()
                .setTitle('Command List')
                .setFields([
                    {name:'Music Commands:', value: musicCmds.join(', ')},
                    {name:'Utility Commands:', value: utilityCmds.join(', ')},
                    {name:'Interaction Commands:', value: interactionCmds.join(', ')},
                    {name:'Fun Commands:', value: funCmds.join(', ')},
                    {name:'Xp Commands:', value: xpCmds.join(', ')},
                    {name:'Game Commands:', value: gamesCmds.join(', ')}
                ])
                .setThumbnail('https://cdn.discordapp.com/emojis/950499487632203877.webp?size=1024&quality=lossless')
                .setFooter({text: message.author.tag, iconURL: message.author.displayAvatarURL()})

            message.reply({embeds: [embed]})
        }else{
            const embed = new Discord.EmbedBuilder()
                .setTitle(`${command.name.toUpperCase()} command`)
                .setThumbnail('https://cdn.discordapp.com/emojis/950499487632203877.webp?size=1024&quality=lossless')
                .setDescription(`
Name: ${command.name.toUpperCase()}
Description: ${command.description}
Type: ${command.type}
Usage: ${command.usage}
${command.aliases ? `Aliases: ${command.aliases.join(', ')}` : ''}
                `)
            
        message.reply({embeds: [embed]})
        }
        return
    }
}