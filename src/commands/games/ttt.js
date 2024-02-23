const buttons = require('../../functions')

module.exports = {
    name:'ttt',
    description:'Play tic-tac-toe with your friends',
    type:'games',
    usage:'>ttt <@mention>',
    async execute(client, message, args, Discord){
        if(!message.mentions.users.first()) return message.reply('Mention someone to play with')
        if(message.mentions.users.first() === message.author.id) return message.reply('So you can win for once?')
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

        client.games.createtttGame(message, players, ['🇽', '🅾️'],{rematch: true})
    }
}

async function offerMatch(message, Discord){
    const row = buttons.makeRow(Discord)
    buttons.makeButton(row, Discord, 'confirm')
    buttons.makeButton(row, Discord, 'decline')


    let msg = await message.channel.send({content:`${message.mentions.users.first()}, Do you accept this Tic-Tac-Toe challenge?`, components:[row]})
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