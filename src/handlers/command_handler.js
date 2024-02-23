const fs = require('fs')

module.exports = (client, Discord) => {
    const commandFiles = fs.readdirSync('./commands/')
    for(const file of commandFiles){
        const folderContents = fs.readdirSync(`./commands/${file}/`).filter(file => file.endsWith('.js'))
        for(commands of folderContents){
            const command = require(`../commands/${file}/${commands}`)
            client.commands.set(command.name, command)
        }
    }
}
