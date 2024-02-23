const rankModel = require('../../Schemas/rankModel')
const {makeRow} = require('../../functions/src/functions')

module.exports = {
    name:'resetxp',
    description:'Resets the Xp for the entire server',
    type:'xp',
    usage:'>resetXp',
    permissions: ["Administrator"],
    async execute(client, message, args, Discord){
        const confirmed = await confirmReset(message, Discord)

        if(confirmed === true){
            return rankModel.updateMany({guildID: message.guild.id}, {$set: {xp: 0, xpTotal: 0, level: 1, msgNum: 0}})
        }
    }
}


async function confirmReset(message, Discord){
    const row = makeRow(Discord)
    makeButton(row, Discord, 'confirm')
    makeButton(row, Discord, 'decline')

    const content = `Are you sure you want to reset all the server's xp`
    let msg = await message.reply({content: content, components:[row]})
    let accepted = false
    

    const filter = (interaction) => interaction.user.id === message.member.id;

    await msg.awaitMessageComponent({filter, time: 180000, max:1})
        .then((interaction) =>{
            switch(interaction.customId){
                case 'confirm':{
                    row.components[0].setStyle('SUCCESS')
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
                    row.components[1].setStyle('DANGER')
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
            for(const button of row){
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
            .setLabel('Confirm')
            .setStyle(Discord.ButtonStyle.Secondary)
            .setCustomId(`confirm`)
        )
        return
    }
    if(type === 'decline'){
        row.addComponents(
            new Discord.ButtonBuilder()
            .setLabel('Cancel')
            .setStyle(Discord.ButtonStyle.Secondary)
            .setCustomId(`decline`)
        )
        return
    }
}

