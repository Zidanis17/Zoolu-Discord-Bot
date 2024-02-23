const fetch = require("node-fetch");

module.exports = {
    name:'joke',
    description:'Make a dark joke',
    type:'fun',
    usage:'>joke',
    async execute(client, message, args, Discord){
        await fetch('https://v2.jokeapi.dev/joke/any?type=single').then((res) => {
            res.json().then(data => {
                message.reply(data.joke)
            })
        })
    }   
}