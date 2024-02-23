const {MessageButton, MessageActionRow, EmbedBuilder} = require('discord.js');
const C4Player = require('./c4/player');
const C4Game = require('./c4/game');
const tttPlayer = require('./ttt/player');
const tttGame = require('./ttt/game');
const HangPlayer = require('./hangman/player');
const HangGame = require('./hangman/game');
const games = new Map()

class Games{
    constructor(client){
        this.client = client
    }

    async createC4Game(message, players, channel, emojis, {rematch}){
        const defaultboard = [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ]
        let playersArray = []
        let i = 1
        if(players[0].piece){
            playersArray = players
        }else{
            for(const player of players){
                playersArray.push(new C4Player(player, i, emojis[i-1]))
                i++
            }
        }

        games.set(message.guild.id, new C4Game(message.guild.id, playersArray, channel, 1, message, defaultboard, rematch ,this.client))
        let game = games.get(message.guild.id)
        let msg = await game.sendInitialMessage()
        game.msg = msg
 
        const messageWon = await game.createTurnSystem()
        return messageWon
    }

    async createtttGame(message, players, emojis, {rematch}){
        const defaultboard = [
            0,0,0,
            0,0,0,
            0,0,0
        ]
        let playersArray = []
        let i = 1
        if(players[0].piece){
            playersArray = players
        }else{
            for(const player of players){
                playersArray.push(new tttPlayer(player, i, emojis[i-1]))
                i++
            }
        }

        games.set(message.guild.id, new tttGame(message, message.channel, playersArray, defaultboard, this.client, rematch))
        let game = games.get(message.guild.id)
        let msg = await game.sendInitialMessage()
        game.msg = msg
        game.createTurnSystem()
        return
    }

    createHangmanGame(message, players, wordArr){
        let playersArray = []
        let i = 1
        if(players[0].piece){
            playersArray = players
        }else{
            for(const player of players){
                playersArray.push(new HangPlayer(player))
                i++
            }
        }

        return new HangGame(message, playersArray, wordArr)
    }
    
    deleteGame(id) {
        games.delete(id)
    }

    getGames() {
        return games
    }

    winEmbed(name, color, type){
        let title

        if(type ==='c4'){
            title = `<:c4Emoji:950224074464968764> Connect Four`
        }
        
        if(type === 'ttt'){
            title = `<:ttt:950188814180184114> Tic-Tac-Toe`
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(`**${name}** has won the game!!`)
            .setColor(color)
            .setImage(`http://img.ghosty.bot/1040x200/${color}/000000/?retina=1&text=Congratulations%2C%20${name}%21&font=yanone`)

        return embed
    }

    drawEmbed(color, type){
        let title

        if(type ==='c4'){
            title = `<:c4Game:950224074464968764> Connect Four`
        }
        
        if(type === 'ttt'){
            title = `<:ttt:950188814180184114> Tic-Tac-Toe`
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription('Ohh what a sad game, **IT ENDS IN A DRAW!!**')
            .setColor(color)
            .setImage(`http://img.ghosty.bot/1040x200/${color}/000000/?retina=1&text=DRAW!&font=yanone`)

        return embed
    }
    
}

module.exports = Games
