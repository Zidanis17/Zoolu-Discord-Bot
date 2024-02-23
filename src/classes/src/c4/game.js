const {ButtonBuilder, ActionRowBuilder, ButtonStyle ,EmbedBuilder} = require('discord.js');

class C4Game{
    
    constructor(guildId, players, channel, turn, message, defaultboard, rematch ,client){
        this.guildId = guildId;
        this.players = players;
        this.channel = channel;
        this.turn = turn;
        this.board = defaultboard;
        this.msg = message;
        this.moves = 0
        this.client = client
        this.rematch = rematch
    }

    async checkForWin(piece){
        let won = {
            won: false,
            piece1: {row: 0, coloumn: 0},
            piece2: {row: 0, coloumn: 0},
            piece3: {row: 0, coloumn: 0},
            piece4: {row: 0, coloumn: 0},
        }
        for( let coloumn = 0;coloumn < 4; coloumn++){
            for(let row = 0; row < 6; row++ ){
                if((this.board[row][coloumn] == piece) && (this.board[row][coloumn + 1] === piece) && (this.board[row][coloumn + 2] === piece) && (this.board[row][coloumn + 3] === piece)){
                    won = {
                        won: true,
                        piece1: {row: row, coloumn: coloumn},
                        piece2: {row: row, coloumn: coloumn + 1},
                        piece3: {row: row, coloumn: coloumn + 2},
                        piece4: {row: row, coloumn: coloumn + 3},
                    }
                    return won
    
                }
            }
        }
        for(let row = 0; row < 3; row++){
            for(let coloumn = 0; coloumn < 7; coloumn++){
                if((this.board[row ][coloumn] == piece) && (this.board[row + 1][coloumn ] === piece) && (this.board[row + 2][coloumn] === piece) && (this.board[row + 3][coloumn ] === piece)){
                    won = {
                        won: true,
                        piece1: {row: row, coloumn: coloumn},
                        piece2: {row: row + 1, coloumn: coloumn},
                        piece3: {row: row + 2, coloumn: coloumn},
                        piece4: {row: row + 3, coloumn: coloumn},
                    }
                    return won
                }
            }
        }
        for( let coloumn = 0;coloumn < 4; coloumn++){
            for(let row = 0; row < 3; row++ ){
                if((this.board[row][coloumn] == piece) && (this.board[row + 1][coloumn + 1] === piece) && (this.board[row + 2][coloumn + 2] === piece) && (this.board[row + 3][coloumn + 3] === piece)){
                    won = {
                        won: true,
                        piece1: {row: row, coloumn: coloumn},
                        piece2: {row: row + 1, coloumn: coloumn + 1},
                        piece3: {row: row + 2, coloumn: coloumn + 2},
                        piece4: {row: row + 3, coloumn: coloumn + 3},
                    }
                    return won
    
                }
            }
        }
        for( let coloumn = 0;coloumn < 4; coloumn++){
            for(let row = 3; row < 6; row++ ){
                if((this.board[row][coloumn] == piece) && (this.board[row - 1][coloumn + 1] === piece) && (this.board[row - 2][coloumn + 2] === piece) && (this.board[row - 3][coloumn + 3] === piece)){
                    won = {
                        won: true,
                        piece1: {row: row, coloumn: coloumn},
                        piece2: {row: row - 1, coloumn: coloumn + 1},
                        piece3: {row: row - 2, coloumn: coloumn + 2},
                        piece4: {row: row - 3, coloumn: coloumn + 3},
                    }
                    return won
    
                }
            }
        }
    
        return won
    }

    async insert_coin(coloumn){
        let coinPlaced = false
                    
        for(let i = 5 ; i > -1 ; i--){
            if(this.board[i][coloumn] === 0){
                this.board[i][coloumn] = this.turn
                coinPlaced = true
                
                break;
            }
        }
        return coinPlaced
    }

    toggleTurn(){
        if(this.turn === 1){
            this.turn = 2
        }else{
            this.turn = 1
        }
        return this.turn
    }

    getStringBoard(){
        let boardString = ''

        for(const row of this.board){
            for (const element of row){
                boardString += `${element} `
            }
            boardString += '\n'
        }
        return boardString
    }

    async createTurnSystem(){
        let winMsg
        let coloumn = await this.makeAnAwait(this.players[(this.turn) - 1])
        if(coloumn === undefined) return this.msg.reactions.removeAll()
        const checkIfValid = await this.insert_coin(coloumn)
        this.moves += 1
        if(!checkIfValid){
            this.createTurnSystem()
            return
        }else{
            let checkedWin = await this.checkForWin(this.turn)
            if(checkedWin.won){
                this.board[checkedWin.piece1.row][checkedWin.piece1.coloumn] = 3
                this.board[checkedWin.piece2.row][checkedWin.piece2.coloumn] = 3
                this.board[checkedWin.piece3.row][checkedWin.piece3.coloumn] = 3
                this.board[checkedWin.piece4.row][checkedWin.piece4.coloumn] = 3
                this.updateMsg()
                this.client.games.deleteGame(this.guildId)
                this.msg.reactions.removeAll()
                const embed = await this.client.games.winEmbed(this.players[this.turn - 1].name ,'4fb0a5', 'c4')
                winMsg = await this.msg.reply({embeds: [embed]})
                if(this.rematch) this.askForRematch(winMsg)
                return
            }else if(this.moves >= 42){
                const embed = await this.client.games.drawEmbed('4fb0a5', 'c4')
                let messageForRematch = await this.msg.reply({embeds: [embed]})
                this.client.games.deleteGame(this.msg.guild.id)
                this.msg.reactions.removeAll()
                if(this.rematch){
                    this.askForRematch(messageForRematch)
                }
                return
            }else{
                this.toggleTurn();
                this.updateMsg();
                this.createTurnSystem();
                return
            }
        }
    }

    async makeAnAwait(player){
        let coloumn = undefined

        const filter = (reaction, user) => (reaction.emoji.name === ('1️⃣') || reaction.emoji.name === ('2️⃣') || reaction.emoji.name === ('3️⃣') || reaction.emoji.name === ('4️⃣') || reaction.emoji.name === ('5️⃣') || reaction.emoji.name === ('6️⃣') || reaction.emoji.name === ('7️⃣')) && user.id === (player.id);

        await this.msg.awaitReactions({filter, time: 300000, max: 1})
            .then(async collected => {
                switch(collected.first().emoji.name){
                    case '1️⃣':{
                        coloumn = 0
                        break;
                    }
                    case '2️⃣':{
                        coloumn = 1
                        break;
                    }
                    case '3️⃣':{
                        coloumn = 2
                        break;
                    }
                    case '4️⃣':{
                        coloumn = 3
                        break;
                    }
                    case '5️⃣':{
                        coloumn = 4
                        break;
                    }
                    case '6️⃣':{
                        coloumn = 5
                        break;
                    }
                    case '7️⃣':{
                        coloumn = 6
                        break;
                    }
                }
                collected.first().users.remove(player.id)
            }).catch(err => {
                console.log(err)
                this.msg.reply(`Sorry, ${player.name} has bailed out of the match`)
                this.client.games.deleteGame(this.guildId)
                return
        })
        return coloumn
    }

    async sendInitialMessage(){
        const embed = new EmbedBuilder()
            .setTitle('<:c4Game:950224074464968764> Connect 4')
            .setDescription(`1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣\n${this.getStringBoard().replaceAll('0', '⚫').replaceAll('1', this.players[0].emoji).replaceAll('2', this.players[1].emoji).replaceAll('3' , '🟡')}`)
            .setFooter({text: `It's your turn, \u200e${this.players[0].name}\u200e! ${this.players[0].emoji} Select a column, e.g. 7`})

        const msg = await this.channel.send({embeds: [embed]})


        await msg.react('1️⃣')
        await msg.react('2️⃣')
        await msg.react('3️⃣')
        await msg.react('4️⃣')
        await msg.react('5️⃣')
        await msg.react('6️⃣')
        await msg.react('7️⃣')
        return msg
    }

    updateMsg(){
        const embed = new EmbedBuilder()
        .setTitle('<:c4Game:950224074464968764> Connect 4')
        .setDescription(`1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣\n${this.getStringBoard().replaceAll('0', '⚫').replaceAll('1', this.players[0].emoji).replaceAll('2', this.players[1].emoji).replaceAll('3' , '🟡')}`)
        .setFooter({text: `It's your turn, \u200e${this.turn === 1 ? this.players[0].name : this.players[1].name}\u200e! ${this.turn === 1 ? this.players[0].emoji : this.players[1].emoji} Select a column, e.g. 7`})
    
        return this.msg.edit({embeds: [embed]})
    }

    async askForRematch(msg){
        const button = new ButtonBuilder()
            .setCustomId('rematch')
            .setLabel('Rematch [0/2]')
            .setEmoji('🔄')
            .setStyle(ButtonStyle.Secondary)

        const row = new ActionRowBuilder().addComponents(
            button
        )
        msg.edit({components: [row]})

        const filter = (interaction) => interaction.customId === 'rematch' && (interaction.user.id === this.players[0].id || interaction.user.id === this.players[1].id);

        const collector = await msg.createMessageComponentCollector({filter, time: 60000})

        let peopleNum = 0
        let playerPressed = []

        await collector.on('collect', async interaction => {
            if(playerPressed.includes(interaction.user.id)) return
            peopleNum += 1
            await row.components[0].setLabel(`Rematch [${peopleNum}/2]`)
            playerPressed.push(`${interaction.user.id}`)          

            if(peopleNum === 2){
                let players = await this.randomizePlayers(this.players)
                await row.components[0].setDisabled()
                await row.components[0].setStyle(ButtonStyle.Success)                
                this.client.games.createC4Game(msg, players, msg.channel, [players[0].emoji ,players[1].emoji], {rematch: true})
                collector.stop()
            }
            await interaction.update({
                components: [row]
            })

            return
        });

        collector.on('end', async (collected,reason) => {
            if(reason === 'time'){
                await button.setDisabled()

                msg.edit({components: [row]})
            }
        });
        return
    }
    
    randomizePlayers(array){
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
    
}

module.exports = C4Game