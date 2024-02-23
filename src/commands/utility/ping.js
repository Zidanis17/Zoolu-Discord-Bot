module.exports = {
    name:'ping',
    description:'Pong',
    type:'utility',
    usage:'>ping',
    execute(client, message, args, Discord){
        message.channel.send('Loading data').then (async (msg) =>{
            msg.delete()
            message.channel.send(`🏓Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
        })
        return
    }
}