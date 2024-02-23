const blackListModels = require('../../Schemas/blacklistmodels');
const permissions = require('../../arrays/permissions.json');
const guildModel = require('../../Schemas/guildModel');
const functions = require('../../functions');
const prefix = '>';

module.exports = async (Discord, client, message) => {
    const user = await blackListModels.findOne({userID: message.author.id});
    let databaseGuild = await guildModel.findOne({guildID: message.guild.id})

    if(databaseGuild === null){
        const profile = await guildModel.create({
            guildID: message.guild.id,
            guildName: message.guild.name,
        })
        const newprofile = await profile.save()
        databaseGuild = newprofile
    }

    if(user !== null) return;
    functions.addXp(message)

    if(!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'DM') return;

    const args = message.content.slice(prefix.length).split(/ +/g);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd))

    if(!command || databaseGuild.disabledCommands.includes(command.name)) return;
    if(!message.channel.permissionsFor(message.guild.members.me).has("SendMessages")) return;

    if(command.permissions){
        let missingUserPerms = []
        let missingBotPerms = []
        let missingChannelPerms = []
        for(const perm of command.permissions){
            if(!permissions.includes(perm)){
                return console.log(`Invalid Permissions ${perm}`);
            }
            if(!message.member.permissions.has(perm)){
                missingUserPerms.push(perm);
            }
            if(!message.guild.members.me.permissions.has(perm)){
                missingBotPerms.push(perm);
            }
            if(!message.channel.permissionsFor(message.guild.members.me).has(perm)){
                missingChannelPerms.push(perm)
            }
          }
        if(missingUserPerms.length){
            return message.channel.send(`Missing Permissions From You: \`${missingUserPerms.join('\n')}\``);
        }

        if(missingBotPerms.length){
            return message.channel.send(`Missing Permissions From Me: \`${missingBotPerms.join('\n')}\``);
        }

        if(missingChannelPerms.length){
            return message.channel.send(`Missing Permissions From Me In The Channel: \`${missingChannelPerms.join('\n')}\``);
        }
    }
    
    if(command.cooldown){
        const flag = functions.checkCooldown(command, message, Discord)

        if(flag !== null){
            return message.reply(flag)
        }
    }

    try{
        await command.execute(client, message ,args, Discord, cmd);
    }catch(err){
        console.log(err)
        message.channel.send('An Error occured while executing the command, sorry')
    }

    return
}