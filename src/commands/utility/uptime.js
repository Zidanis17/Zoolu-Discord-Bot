module.exports = {
    name:'uptime',
    description:'How long has the bot been alive',
    type:'utility',
    usage:'>uptime',
    async execute(client, message, args, Discord){
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        let array = []
        days > 0 ? array.push(`${days} days`) : ''
        hours > 0 ? array.push(`${hours} hours`) : ''
        minutes > 0 ? array.push(`${minutes} minutes`): ''
        seconds > 0 ? array.push(`${seconds} seconds`): ''

        return message.reply(`I've been alive for ${array.join(', ')}`)
    }
}