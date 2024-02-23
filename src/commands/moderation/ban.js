const functions = require('../../functions/src/functions')

module.exports = {
    name:'ban',
    description:'Bans a member if you can do so',
    type:'moderation',
    usage:'>ban <@member> <day of messages to delete>(must be between 0-7)(0 if no messages to be deleted) <reason>(optional)',
    permissions: ['BanMembers'],
    async execute(client, message, args, Discord){ 
        if(!message.mentions.members.first()) return message.reply('Please mention a member to ban')
        
        const MemToBan = message.mentions.members.first()
        const banner = message.member
        const bot = message.guild.members.me

        let checked = await functions.checkIfManageable(banner, MemToBan, bot)

        if(checked === 'memRoleLower'){
            return message.reply('Your highest role is lower than the role of the member you\'re trying to ban')
        }

        if(checked === 'botRoleLower'){
            return message.reply('The bot can\'t moderate this user because he has a higher position than me or he is the owner')
        }

        if(checked === true){
            if(await confirmBan(message, Discord)){
                return MemToBan.ban({days: args[1] && parseInt(args[1]) && 0 <= parseInt(args[1]) <= 7 ? args[1] : 0, reason: args[2] ? args.slice(2).join(' ')  : ''})
            }
        }
        return
    }
}

async function confirmBan(message, Discord){
    const row = functions.makeRow(Discord)
    makeButton(row, Discord, 'confirm')
    makeButton(row, Discord, 'decline')

    const content = `Are you sure you want to ban ${message.mentions.members.first().displayName}?`
    let msg = await message.reply({content: content, components:[row]})
    let accepted = false
    

    const filter = (interaction) => interaction.user.id === message.member.id;

    await msg.awaitMessageComponent({filter, time: 180000, max:1})
        .then((interaction) =>{
            switch(interaction.customId){
                case 'confirm':{
                    row.components[0].setStyle(Discord.ButtonStyle.Danger)
                    for(const button of row.components){
                        button.setDisabled()
                    }
                    interaction.update({
                        content: content,
                        components: [row]
                    })
                    accepted = true
                    break;
                } 
                case 'decline':{
                    row.components[1].setStyle(Discord.ButtonStyle.Success)
                    for(const button of row.components){
                        button.setDisabled()
                    }
                    interaction.update({
                        content: content,
                        components: [row]
                    })
                    accepted = false
                    break;
                }

            }
        }).catch((err) =>{
            accepted = false
            for(const button of row.components){
                button.setDisabled()
            }
            msg.edit({content: content, components: [row]})
            return accepted
        })
    return accepted
}

function makeButton(row, Discord, type){
    if(type === 'confirm'){
        row.addComponents(
            new Discord.ButtonBuilder()
            .setLabel('Ban')
            .setStyle(Discord.ButtonStyle.Secondary)
            .setCustomId(`confirm`)
        )
        return
    }
    if(type === 'decline'){
        row.addComponents(
            new Discord.ButtonBuilder()
            .setLabel('Forgive')
            .setStyle(Discord.ButtonStyle.Secondary)
            .setCustomId(`decline`)
        )
        return
    }
}