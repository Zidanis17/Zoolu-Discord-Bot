const buttons = require('../../functions')

module.exports = {
    name:'hangman',
    description:'Guess the letter of the word making it afun game for the whole family',
    type:'games',
    usage:'>hangman',
    permissions: ['ManageMessages'],
    async execute(client, message, args, Discord){
        const gameConfirmObject = await confrimGame(message, Discord)

        if(!gameConfirmObject.accepted){
            gameConfirmObject.msg.delete()
            return message.reply('Cancelled hangman game')
        }else{
            gameConfirmObject.msg.delete()
        }


        confirmPlayers(message, Discord)
        
    }
}


async function confrimGame(message, Discord){
    const row = buttons.makeRow(Discord)
    buttons.makeButton(row, Discord, 'confirm')
    buttons.makeButton(row, Discord, 'decline')


    let msg = await message.channel.send({content:`Are you sure you want to start this Hangman game`, components:[row]})
    let object = {
        msg: msg,
        accepted: false
    }
    

    const filter = (interaction) =>interaction.user.id === message.author.id;

    await msg.awaitMessageComponent({filter, time: 180000, max:1})
        .then( (interaction) =>{
            switch(interaction.customId){
                case 'confirm':{
                    object.accepted = true
                    break;
                } 
                case 'decline':{
                    interaction.deferUpdate()
                    object.accepted = false
                    break;
                }

            }
        }).catch((err) =>{
            object.accepted = false
        })
    return object

}

async function confirmPlayers(message, Discord){
    const row = buttons.makeRow(Discord)
    buttons.makeButton(row, Discord, 'JOIN')
    buttons.makeButton(row, Discord, 'LEAVE')


    let msg = await message.channel.send({content:`WHO WANTS TO JOIN A HANGMAN GAME?`, components:[row]})
    let object = {
        msg: msg,
        players: [message.author],
        accepted: false
    }
    
    let players = object.players

    const filter = e => e;

    await msg.awaitMessageComponent({filter, time: 180000})
        .then( async (interaction) =>{
            switch(interaction.customId){
                case 'join':{
                    if(!players.includes(interaction.user)){
                        players.push(interaction.user)
                        await interaction.deferUpdate()
                    }else{
                        await interaction.reply({content: 'You are already in the game!',  ephemeral: true })
                    }
                    console.log(players)
                    break;
                } 
                case 'leave':{
                    if(players.includes(interaction.user)){
                        players.filter(plr => plr.id === interaction.user.id)
                    }else{
                        interaction.deferUpdate()
                    }
                    console.log(players)
                    break;
                }

            }
        }).catch((err) =>{
            return console.log(err)
        })

    return console.log(object)
}