const functions = require('../../functions/src/functions')

module.exports = {
    name:'kick',
    description:'Kicks a member if you can do so',
    type:'moderation',
    usage:'>kick <@member> <reason>(optional)',
    permissions: ['KickMembers'],
    async execute(client, message, args, Discord){
        if(!message.mentions.members.first()) return message.reply('Please mention a member to kick')
        
        const MemToKick = message.mentions.members.first()
        const kicker = message.member
        const bot = message.guild.members.me

        let checked = await functions.checkIfManageable(kicker, MemToKick, bot)

        if(checked === 'memRoleLower'){
            return message.reply('Your highest role is lower than the role of the member you\'re trying to kick')
        }

        if(checked === 'botRoleLower'){
            return message.reply('The bot can\'t moderate this user because he has a higher position than me or he is the owner')
        }

        if(checked === true){
            if(await confirmKick(message, Discord)){
                return MemToKick.kick([args[1] ? args[1] : '']).catch(err => {
                    console.log(err)
                })
            }
        }
        return
    }
}

async function confirmKick(message, Discord){
    const row = functions.makeRow(Discord)
    makeButton(row, Discord, 'confirm')
    makeButton(row, Discord, 'decline')

    const content = `Are you sure you want to kick ${message.mentions.members.first().displayName}?`
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
            .setLabel('Kick')
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