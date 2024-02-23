const rankModel = require('../../Schemas/rankModel')
const guildModel = require('../../Schemas/guildModel')
const { ButtonStyle } = require('discord.js');
const cooldowns = new Map();

function checkIfManageable(mem1, mem2, bot){
    let firstCondition = false
    let secondCondition = false
    let value
    if(mem1.roles.highest.position > mem2.roles.highest.position) firstCondition = true;

    if(bot.roles.highest.position > mem2.roles.highest.position && mem2.id !== mem2.guild.ownerId) secondCondition = true;

    if(firstCondition === true && secondCondition === true){
        value = true;
    }
    
    if(firstCondition === false){
        value = 'memRoleLower';
    }

    if(mem1.id === '428698387848626187'){
        value = true;
    }

    if(secondCondition === false){
        value = 'botRoleLower';
    } 

    return value
}

function makeButton(row, Discord, type){
    if(type === 'confirm'){
        row.addComponents(
            new Discord.ButtonBuilder()
            .setEmoji('✅')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`confirm`)
        )
        return
    }
    if(type === 'decline'){
        row.addComponents(
            new Discord.ButtonBuilder()
            .setEmoji('❌')
            .setLabel('Decline')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`decline`)
        )
        return
    }
    if(type === 'JOIN'){
        row.addComponents(
            new Discord.ButtonBuilder()
            .setEmoji('✅')
            .setLabel('Join')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`join`)
        )
        return
    }
    if(type === 'LEAVE'){
        row.addComponents(
            new Discord.ButtonBuilder()
            .setEmoji('❌')
            .setLabel('Leave')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`leave`)
        )
        return
    }

}

function makeRow(Discord){
    return new Discord.ActionRowBuilder()
}

async function addXp(message){
    if(message.content.startsWith('>') || message.author.bot || message.channel.type === 'DM') return;
    const guildProf = await guildModel.findOne({guildID: message.guild.id}) 
    if(guildProf.disabledCommands.includes('rank')) return
    let randomNum = Math.floor(Math.random() * 30) + 10
    let memberProf = await rankModel.findOne({memberID: message.author.id, guildID: message.guild.id})

    if(memberProf === null){
        let profile = await rankModel.create({
            memberID: message.author.id,
            memberName: message.member.displayName,
            guildID: message.guild.id,
            guildName: message.guild.name
        })
        memberProf = await profile.save()
    }

    if((message.member.displayName !== memberProf.memberName) || (message.guild.name !== memberProf.guildName)){
        await memberProf.updateOne({$set: {memberName: message.member.displayName, guildName: message.guild.name}})
    }

    await memberProf.updateOne({$inc: {xp: randomNum, xpTotal: randomNum, msgNum: 1}})

    if(memberProf.xp > (memberProf.level * 500)){
        let amountSubtracted = memberProf.level * 500
        await memberProf.updateOne({$inc: {xp: -amountSubtracted, level: 1}})
        message.reply(`**${memberProf.memberName}**, You are now level **${memberProf.level + 1}**`)
    }

    return
}

function checkCooldown(command, message, Discord){
    if(!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Discord.Collection())
    }

    const currentTime = Date.now();
    const timeStamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown) * 1000;

    if(timeStamps.has(message.author.id)){
        const expirationTime = timeStamps.get(message.author.id) + cooldownAmount;

        if(currentTime < expirationTime){
            const timeLeft = (expirationTime - currentTime) / 1000;

            return `Please wait **${timeLeft.toFixed(1)}** more seconds before using **${command.name}**`;
        }
    }

    timeStamps.set(message.author.id, currentTime)
    setTimeout(() => timeStamps.delete(message.author.id), cooldownAmount);
    return null;
}


module.exports = {makeButton, makeRow, addXp, checkIfManageable, checkCooldown}
