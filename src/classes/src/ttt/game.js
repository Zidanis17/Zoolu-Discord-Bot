const {ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle} = require('discord.js')

class tttGame{
    
    constructor(message, channel, players, defaultBoard, client, rematch){
        this.msg = message;
        this.channel = message.channel;
        this.board = defaultBoard;
        this.client = client;
        this.components = [];
        this.rematch = rematch;
        this.players = players;
        this.turn = 1
        this.moves = 0
    }


    async createTurnSystem(){
        let player = this.players[this.turn - 1]
        let interaction = await this.makeAnAwait(player)

        if(interaction === undefined){
            this.client.games.deleteGame(this.msg.guild.id)
            return this.msg.reply(`Sorry, ${player.name} has bailed out of the match`).catch()
        }

        await this.insert_symbol(interaction.customId, player.piece)
        await interaction.update({
            components:this.components
        })
        this.moves += 1

        let checkedWin = await this.checkForWin(player.piece)
        if(checkedWin.won === true){
            for(const custId of checkedWin.buttons){
                for(const row of this.components){
                    for(let button of row.components){
                        button.setDisabled()
                        if(custId === parseInt(button.data.custom_id)){
                            button.setStyle(ButtonStyle.Success)
                        }
                    }
                }
            }
            this.msg.edit({embeds: [this.msg.embeds[0]], components:this.components})
            this.client.games.deleteGame(this.msg.guild.id)
            const embed = await this.client.games.winEmbed(player.name, '5490AB', 'ttt')
            let messageForRematch = await this.msg.reply({embeds: [embed]})
            if(this.rematch){
                this.askForRematch(messageForRematch)
            }
            return    
        }else if(this.moves >= 9){           
            const embed = await this.client.games.drawEmbed('5490AB', 'ttt')
            let messageForRematch = await this.msg.reply({embeds: [embed]})
            this.client.games.deleteGame(this.msg.guild.id)
            if(this.rematch){
                this.askForRematch(messageForRematch)
            }
            return
        }
        else{
            this.toggleTurn()
            this.createTurnSystem()
            return
        }
    }

    async makeAnAwait(player){
        let interaction
        const filter = (interaction) => interaction.user.id === player.id

        await this.msg.awaitMessageComponent({ filter, time: 180000, max: 1 })
            .then(async button => {
                let custId = button.customId
                interaction = button
                    
                for(const row of this.components){
                    for(let button of row.components){
                        if(custId === button.data.custom_id){                                    
                            button.setStyle(player.emoji === '🇽'? ButtonStyle.Primary : ButtonStyle.Danger)
                            button.setLabel('‎')
                            button.setEmoji(player.emoji)
                            button.setDisabled()
                        }
                    }
                }
            })  
            .catch(err => {
                interaction = undefined
                console.log(err)
                return
            });
        return interaction
    }


    insert_symbol(position, type){
        this.board[position] = type
        return
    }


    checkForWin(type){
        let won = {
            won: false,
            buttons: []
        }
    
        //Check for horizontal wins
        for(let i = 0; i < 9; i += 3){
            if((this.board[i] === type) && (this.board[i + 1] === type) && (this.board[i + 2] === type)){
                return won = {
                    won: true,
                    buttons: [i, i + 1, i + 2]
                }
            }
        }
    
        //Check for vertical wins
        for(let i = 0; i < 3; i++){
            if((this.board[i] === type) && (this.board[i + 3] === type) && (this.board[i + 6] === type)){
                return won = {
                    won: true,
                    buttons: [i, i + 3, i + 6]
                }
            }
        }
    
        //Check for negative slope win
        if((this.board[0] === type) && (this.board[4] === type) && (this.board[8] === type)){
            return won = {
                won: true,
                buttons: [0, 4, 8]
            }
        }
    
        //Check for positive slope win
        if((this.board[6] === type) && (this.board[4] === type) && (this.board[2] === type)){
            return won = {
                won: true,
                buttons: [6, 4, 2]
            }
        }
    
        return won
    }


    async sendInitialMessage(){
        let k = 0

        for(let j = 0; j < 3; j++){
            let row = new ActionRowBuilder()
            for(let i = 0; i < 3 ; i++){
                await row.addComponents(
                    new ButtonBuilder()
                        .setLabel('⠀')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(`${k}`)
                );
                k += 1
            }
            this.components.push(row)
        }
        const embed = new EmbedBuilder()
            .setTitle('<:ttt:950188814180184114> Tic-Tac-Toe')
            .setDescription(`○ ${this.players[0].name} ${this.players[0].emoji}
                        ○ ${this.players[1].name} ${this.players[1].emoji} `
                    )
            .setThumbnail('https://play-lh.googleusercontent.com/f_aMNED4-kxCcBV13XyEvYagUCiqMIA7PpCtYlCvc0kd3567pJ4NigLiM7RLN5vFx-A')

        return await this.msg.channel.send({embeds: [embed], components:this.components})
    }


    toggleTurn(){
        if(this.turn === 1){
            this.turn = 2
        }else{
            this.turn = 1
        }
        return this.turn
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
                await row.components[0].setDisabled()
                await row.components[0].setStyle(ButtonStyle.Success)
                this.client.games.createtttGame(msg,(await this.randomizePlayers(this.players)), ['🇽' ,'🅾️'], {rematch: true})
            }
            await interaction.update({
                components: [row]
            })

            return
        });

        collector.on('end', async (collected,reason) => {
            if(reason === 'time'){
                await button.setDisabled()

                msg.edit({ components: [row]})
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




module.exports = tttGame