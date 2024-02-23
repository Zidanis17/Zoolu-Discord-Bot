module.exports = {
    name:'coinflip',
    description:'Flip a coin!',
    type:'fun',
    usage:'>coinflip',
    execute(client, message, args, Discord){
        const sides = [
            {side:'HEADS', photo: 'https://cdn.discordapp.com/attachments/930817105832603668/954439075530686504/Heads.png'}, 
            {side:'TAILS', photo: 'https://cdn.discordapp.com/attachments/930817105832603668/954437783676649542/tails.png'}
        ]
        const randNum = Math.floor(Math.random() * 2)
        

        const embed = new Discord.EmbedBuilder()
            .setTitle('🪙 COINFLIP')
            .setThumbnail(sides[randNum].photo)
            .setDescription(`Coin landed on ${sides[randNum].side}!!!`)
            .setImage(sides[randNum].photo)

        message.reply({embeds: [embed]})
    }
}