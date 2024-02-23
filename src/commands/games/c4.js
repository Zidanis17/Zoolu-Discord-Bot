const { ButtonBuilder } = require('discord.js')
const buttons = require('../../functions')

module.exports = {
    name:'c4',
    description:'Play connect 4 game with your friend',
    type:'games',
    usage:'>c4 <@mention>',
    permissions: ['ManageMessages'],
    async execute(client, message, args, Discord){
        if(!message.mentions.users.first()) return message.reply('Mention someone to play with')
        let gameMap = client.games.getGames()
        let playerInGame = false

        if(gameMap.size > 0){
            for(const game of gameMap){
                for(const player of game[1].players){
                    if(message.author.id == player.id || message.mentions.users.first().id == player.id){
                        playerInGame = true
                        break
                    }
                }
                if(playerInGame === true) break
            }
        }

        if(playerInGame === true) return message.reply('You or the person you mentioned are already in a game')

        const offer = await offerMatch(message, Discord)

        if(!offer.accepted){
            offer.msg.edit({content:`Sorry ${message.member}, ${message.mentions.users.first().username} rejected your offer`, components: []})
            await setTimeout(() => {
                offer.msg.delete()
            }, 30000)
            return
        }else{
            offer.msg.delete()
        }

        let players = randomizePlayers([message.member, message.mentions.members.first()])
        let emojis = await askForEmojis(message, players, Discord)
        let channel = message.channel

        client.games.createC4Game(message, players, channel, emojis, {rematch: true})
    }
}

async function offerMatch(message, Discord){
    const row = buttons.makeRow(Discord)
    buttons.makeButton(row, Discord, 'confirm')
    buttons.makeButton(row, Discord, 'decline')


    let msg = await message.channel.send({content:`${message.mentions.users.first()}, Do you accept this Connect-4 challenge?`, components:[row]})
    let object = {
        msg: msg,
        accepted: false
    }
    

    const filter = (interaction) =>interaction.user.id === message.mentions.users.first().id;

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

function randomizePlayers(array){
    let currentIndex = array.length
    let randomIndex
    
    
    while(currentIndex !== 0){
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        let temp = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temp
    }

    return array
}

async function askForEmojis(message, playersArray ,Discord){
    let components = []
    let k = 0
    let emojis = ['🔴', '🔵', '🟤', '🟢', '🟠', '🟣', '⚪', 'Ⓜ️', '⭕']
    let emojisPicked = ['🔴', '🔵']


    for(let j = 0; j < 3; j++){
        let row = new Discord.ActionRowBuilder()
        for(let i = 0; i < 3 ; i++){
            await row.addComponents(
                new Discord.ButtonBuilder()
                    .setLabel('‎')
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setCustomId(`${k}`)
                    .setEmoji(emojis[k])
            );
            k += 1
        }
        components.push(row)
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle('COIN SELECT')
        .setDescription('Please pick your Coin')

    const msg = await message.channel.send({embeds: [embed], components: components})

    let peopleNum = 0
    let playerPressed = []

    const filter = (interaction) => interaction.user.id === message.author.id || interaction.user.id === message.mentions.users.first().id;

    while(peopleNum < 2){
        await msg.awaitMessageComponent({ filter, time: 30000, max: 1})
            .then(async interaction => {
                let custId = interaction.customId

                if(playerPressed.includes(interaction.user.id)) return;

                playerPressed.push(interaction.user.id)
                peopleNum += 1
                for(const row of components){
                    for(let button of row.components){
                        if(custId === button.data.custom_id){                                  
                            button
                            .setStyle(Discord.ButtonStyle.Success)
                            .setDisabled(true)
                            if(interaction.user === playersArray[0].user) emojisPicked[0] = button.data.emoji.name;
                            if(interaction.user === playersArray[1].user) emojisPicked[1] = button.data.emoji.name;
                        }
                    }
                }

                console.log
                await interaction.update({
                    components: components
                })
                return;
            }).catch(err => {
                peopleNum = 2
                return
            })
    }

    await msg.delete()
    return emojisPicked
}
